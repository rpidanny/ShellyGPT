export function getInputCommand(): string {
  return `Create calendar events for next week:
	- Meeting with John on Monday from 9am to 10am
	- Lunch with Jane on Wednesday from 12pm to 1pm`;
}

export function getInputPrompt(cmd: string): string {
  return `You are an amazing events planner / scheduler. Your job is to create calendar invites for different tasks. Create a plan for the following situation:

${cmd}

The output should be a markdown code snippet formatted in the following schema:

\`\`\`json
{
	"name": string // Name of the event event
	"events": {
		"start": string // Start date of the event
		"end": string // Env date of the event
		"summary": string // Summary of the event
		"description": string // Description of the event
		"location": string // Optional // Location of the event if any
		"url": string // Optional // URL of the event if any
	}[]
}
\`\`\`

Including the leading and trailing \"\`\`\`json" and "\`\`\`\"
`;
}

export function getOutputPrompt(): string {
  return `
	\`\`\`json
	{
		"name": "events",
		"events": [
			{
				"start": "2023-05-08T09:00:00.000Z",
				"end": "2023-05-08T10:00:00.000Z",
				"summary": "Meeting with John",
				"description": "",
				"location": "",
				"url": ""
			},
			{
				"start": "2023-05-10T12:00:00.000Z",
				"end": "2023-05-10T13:00:00.000Z",
				"summary": "Lunch with Jane",
				"description": "",
				"location": "",
				"url": ""
			}
		]
	}
	\`\`\`
	`;
}

export function getIcsString(): string {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//sebbo.net//ical-generator//EN
NAME:events
X-WR-CALNAME:events
BEGIN:VEVENT
UID:UUID_PLACEHOLDER
SEQUENCE:0
DTSTAMP:20191021T000000Z
DTSTART:20230508T090000Z
DTEND:20230508T100000Z
SUMMARY:Meeting with John
DESCRIPTION:
END:VEVENT
BEGIN:VEVENT
UID:UUID_PLACEHOLDER
SEQUENCE:0
DTSTAMP:20191021T000000Z
DTSTART:20230510T120000Z
DTEND:20230510T130000Z
SUMMARY:Lunch with Jane
DESCRIPTION:
END:VEVENT
END:VCALENDAR`;
}
