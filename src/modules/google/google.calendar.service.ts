import { google } from "googleapis";
import { getAuthenticatedClient } from "./google.auth.service";

export const createMeetLink = async (booking: any, userId: string) => {
  
  const authClient = await getAuthenticatedClient(userId);

  const calendar = google.calendar({
    version: "v3",
    auth: authClient,
  });

  const event = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: "Tutoring Session",
      start: {
        dateTime: booking.startTime.toISOString(),
      },
      end: {
        dateTime: booking.endTime.toISOString(),
      },
      conferenceData: {
        createRequest: {
          requestId: booking.id,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  const meetLink =
    event.data.conferenceData?.entryPoints?.[0]?.uri;

  return meetLink;
};