import { Request, Response } from 'express';
import { db } from '../db';
import { usersTable } from "../db/schema";
import { eventsTable } from '../db/schema';
import { registrationsTable } from '../db/schema';
import { eq, and, count, sql, asc } from 'drizzle-orm';

export const createEvent=async(req: Request, res: Response)=>{
  try {
    const { title, datetime, location, capacity } = req.body;
    if (!title|| !datetime || !location || !capacity) {
        res.status(400).json({ message: 'Missing fields' });
        return;
    }
    if (capacity <= 0 || capacity > 1000) {
        res.status(400).json({ message: 'Invalid capacity' });
        return;
    }
    const [event] = await db.insert(eventsTable).values({ title, datetime, location, capacity }).returning();
    res.status(201).json({ data: event });
    return;
  } catch (error) {
      res.status(500).json({message: error});
      return;
  }
}
export const registerEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId));

    if (!event)  {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (new Date(event.datetime) < new Date())  {
      res.status(400).json({ message: 'Cannot register for past events' });
      return;
    }

    const [existing] = await db.select().from(registrationsTable)
      .where(and(eq(registrationsTable.eventId, eventId), eq(registrationsTable.userId, userId)));

    if (existing)  {
      res.status(400).json({ message: 'User already registered' });
      return;
    }

    const [{ count: eventCount }] = await db.select({ count: count() }).from(registrationsTable).where(eq(registrationsTable.eventId, eventId));

    if (eventCount >= event.capacity)  {
      res.status(400).json({ message: 'Event is full' });
      return;
    }

    await db.insert(registrationsTable).values({ eventId, userId });
    res.status(201).json({ message: 'Registered successfully' });
    return;
  } catch (error) {
    res.status(500).json({message: error});
    return;
  }
};
export const getEventDetails = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId));
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    const usersRegistered = await db.select({ id: usersTable.id,
         name: usersTable.username,
         email: usersTable.email 
    })
      .from(registrationsTable)
      .leftJoin(usersTable, eq(usersTable.id, registrationsTable.userId))
      .where(eq(registrationsTable.eventId, eventId));

    res.status(200).json({ event, registeredUsers: usersRegistered });
    return;
  } catch (error) {
    res.status(500).json({message: error});
    return;
  }
};

export const cancelRegistration = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = parseInt(req.params.userId);

    const [existing] = await db.select().from(registrationsTable)
      .where(and(eq(registrationsTable.eventId, eventId), eq(registrationsTable.userId, userId)));

    if (!existing) {
      res.status(404).json({ message: 'Registration not found' });
      return;
    }
    await db.delete(registrationsTable).where(eq(registrationsTable.id, existing.id));
    res.status(200).json({ message: 'Registration cancelled' });
    return;
  } catch (error) {
    res.status(500).json({message: error});
    return;
  }
};

export const upcomingEvents = async (req: Request, res: Response) => {
  try {
    const now = new Date().toISOString();
    
    const upcomingEvents = await db.select().from(eventsTable)
      .where(sql`${(eventsTable.datetime)} > ${now}`)
      .orderBy(asc(eventsTable.datetime), asc(eventsTable.location));
    if(!upcomingEvents){
      res.status(404).json({message: "NO Upcoming Events"});
      return;
    }
    res.status(200).json({data: upcomingEvents });
    return;
  } catch (error) {
    res.status(500).json({message: error});
    return;
  }
};

export const getEventStats = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId));
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    const [{ count: totalRegistrations }] = await db.select({ count: count() }).from(registrationsTable).where(eq(registrationsTable.eventId, eventId));
    const remainingCapacity = event.capacity - totalRegistrations;
    const percentageUsed = ((totalRegistrations / event.capacity) * 100).toFixed(2);

    res.status(200).json({ totalRegistrations, remainingCapacity, percentageUsed: `${percentageUsed}%` });
    return;
  } catch (error) {
    res.status(500).json({message: error});
    return;
  }
};