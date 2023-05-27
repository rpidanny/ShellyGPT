export function getInputCommand(): string {
  return `Create calendar events for next week:
	- Meeting with John on Monday from 9am to 10am
	- Lunch with Jane on Wednesday from 12pm to 1pm`;
}

export function getInputPrompt(cmd: string): string {
  return `You are an amazing events planner / scheduler. Your job is to create calendar invites for different tasks. Create a plan for the following situation:

${cmd}

You must format your output as a JSON value that adheres to a given "JSON Schema" instance.

"JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.

For example, the example "JSON Schema" instance {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}}
would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property semantically describes it as "a list of test words". The items within "foo" must be strings.
Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema exactly and there are no trailing commas!

Here is the JSON Schema instance your output must adhere to. Include the enclosing markdown codeblock:
\`\`\`json
{"type":"object","properties":{"name":{"type":"string","description":"Name of the event event"},"events":{"type":"array","items":{"type":"object","properties":{"start":{"type":"string","description":"Start date of the event"},"end":{"type":"string","description":"Env date of the event"},"summary":{"type":"string","description":"Summary of the event"},"description":{"type":"string","description":"Description of the event"},"location":{"type":"string","description":"Location of the event if any"},"url":{"type":"string","description":"URL of the event if any"}},"required":["start","end","summary","description"],"additionalProperties":false}}},"required":["name","events"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}
\`\`\`
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
