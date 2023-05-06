import { BaseLLM } from 'langchain/llms/base';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from 'langchain/prompts';
import { BaseFileStore } from 'langchain/schema';
import { Tool, ToolParams } from 'langchain/tools';
import { z } from 'zod';

interface ICalParams extends ToolParams {
  store: BaseFileStore;
  llm: BaseLLM;
}

export class ICalTool extends Tool {
  name = 'iCal';

  description = 'Useful for creating iCal calendar events';

  eventsSchema = z.object({
    name: z.string().describe('Name of the event event'),
    events: z.array(
      z.object({
        start: z.string().describe('Start date of the event'),
        end: z.string().describe('Env date of the event'),
        summary: z.string().describe('Summary of the event'),
        description: z.string().describe('Description of the event'),
        location: z
          .string()
          .describe('Location of the event if any')
          .optional(),
        url: z.string().describe('URL of the event if any').optional(),
      })
    ),
  });

  store: BaseFileStore;

  llm: BaseLLM;

  constructor({ store, llm, verbose, callbacks }: ICalParams) {
    super(verbose, callbacks);
    this.store = store;
    this.llm = llm;
  }

  /** @ignore */
  async _call(input: string): Promise<string> {
    const { name, events } = await this.getEventsObject(input);
    const { ical } = await this.imports();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const calendar = ical.default({ name });

    for (const event of events) {
      calendar.createEvent({
        start: new Date(event.start),
        end: new Date(event.end),
        summary: event.summary,
        description: event.description,
        location: event.location,
        url: event.url,
      });
    }

    await this.store.writeFile(`${name}.ics`, calendar.toString());

    return `${name}.ics created successfully`;
  }

  private async imports() {
    try {
      const ical = await import('ical-generator');
      return { ical };
    } catch (e) {
      console.error(e);
      throw new Error(
        'Failed to load ical-generator. Please install it with eg. `npm install ical-generator`.'
      );
    }
  }

  private async getEventsObject(
    inputStr: string
  ): Promise<z.infer<typeof this.eventsSchema>> {
    const parser = StructuredOutputParser.fromZodSchema(this.eventsSchema);

    const formatInstructions = parser.getFormatInstructions();

    const prompt = new PromptTemplate({
      template:
        'You are an amazing events planner / scheduler. Your job is to create calendar invites for different tasks. Create a plan for the following situation:\n\n{action}\n\n{format_instructions}',
      inputVariables: ['action'],
      // eslint-disable-next-line camelcase
      partialVariables: { format_instructions: formatInstructions },
    });

    const input = await prompt.format({
      action: inputStr,
    });

    const response = await this.llm.call(input);

    try {
      const eventsObject = parser.parse(response);
      return eventsObject;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
