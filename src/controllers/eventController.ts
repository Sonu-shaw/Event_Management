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
        }
        if (capacity <= 0 || capacity > 1000) {
            res.status(400).json({ message: 'Invalid capacity' });
        }
        const [event] = await db.insert(eventsTable).values({ title, datetime, location, capacity }).returning();
        res.status(201).json({ data: event });
        } catch (error) {
            res.status(500).json({msg: error});
        }
}
export const registerEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const { userId } = req.body;

    if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
    }

    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId));

    if (!event)  {
        res.status(404).json({ message: 'Event not found' });
    }

    if (new Date(event.datetime) < new Date())  {
        res.status(400).json({ message: 'Cannot register for past events' });
    }

    const [existing] = await db.select().from(registrationsTable)
      .where(and(eq(registrationsTable.eventId, eventId), eq(registrationsTable.userId, userId)));

    if (existing)  {
        res.status(400).json({ message: 'User already registered' });
    }

    const [{ count: eventCount }] = await db.select({ count: count() }).from(registrationsTable).where(eq(registrationsTable.eventId, eventId));

    if (eventCount >= event.capacity)  {
        res.status(400).json({ message: 'Event is full' });
    }

    await db.insert(registrationsTable).values({ eventId, userId });
    res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
            res.status(500).json({msg: error});
    }
};
export const getEventDetails = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId));
    if (!event) {
         res.status(404).json({ message: 'Event not found' });
    }
    const usersRegistered = await db.select({ id: usersTable.id,
         name: usersTable.username,
         email: usersTable.email 
    })
      .from(registrationsTable)
      .leftJoin(usersTable, eq(usersTable.id, registrationsTable.userId))
      .where(eq(registrationsTable.eventId, eventId));

    res.status(200).json({ event, registeredUsers: usersRegistered });
    } catch (error) {
        res.status(500).json({msg: error});
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
    }
    await db.delete(registrationsTable).where(eq(registrationsTable.id, existing.id));
    res.status(200).json({ message: 'Registration cancelled' });
    } catch (error) {
        res.status(500).json({msg: error});
    }
};

export const upcomingEvents = async (req: Request, res: Response) => {
  try {
    const now = new Date().toISOString();
    
    const upcomingEvents = await db.select().from(eventsTable)
      .where(sql`${(eventsTable.datetime)} > ${now}`)
      .orderBy(asc(eventsTable.datetime), asc(eventsTable.location));
    res.status(200).json({data: upcomingEvents });
    } catch (error) {
        res.status(500).json({msg: error});
    }
};

export const getEventStats = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId));
    if (!event) {
        res.status(404).json({ message: 'Event not found' });
    }

    const [{ count: totalRegistrations }] = await db.select({ count: count() }).from(registrationsTable).where(eq(registrationsTable.eventId, eventId));
    const remainingCapacity = event.capacity - totalRegistrations;
    const percentageUsed = ((totalRegistrations / event.capacity) * 100).toFixed(2);

    res.status(200).json({ totalRegistrations, remainingCapacity, percentageUsed: `${percentageUsed}%` });
    } catch (error) {
        res.status(500).json({msg: error});
    }
};