import express from "express"
import { cancelRegistration, createEvent, getEventDetails, getEventStats, registerEvent, upcomingEvents } from "../controllers/eventController";

const router  = express.Router()

router.post("/create", createEvent);// create event     http://localhost:3000/event/create
router.get('/upcoming', upcomingEvents); // check upcoming event    http://localhost:3000/event/upcoming
router.get("/:eventId", getEventDetails); // get event details by id    http://localhost:3000/event/:eventId
router.post("/:eventId/register-event", registerEvent); // assign event     http://localhost:3000/event/:eventId/register-event
router.delete("/:eventId/register-event/:userId", cancelRegistration); // cancel event  http://localhost:3000/event/:eventId/register-event/:userId
router.get('/:eventId/stats', getEventStats); // get event stats    http://localhost:3000/event/:eventId/stats

export const EventRoutes = router;