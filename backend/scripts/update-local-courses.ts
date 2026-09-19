import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const staticCourses = [
  {
    slug: "ai-for-business-applications",
    persona: "Youth",
    title: "AI for Business Applications",
    category: "01",
    description: "The work of an ordinary office — writing, organising, finding things out, presenting and reading numbers — done with an AI assistant beside you.",
    overview: "Five sessions covering the everyday work of an office: correspondence, planning, research, presentation and analysis. Each session ends with a finished piece of work you produced yourself, with the AI assistant credited and every factual claim verified.",
    tone: "bg-sky",
    tier: "Basic",
    country: "Global",
    outcomes: [
      "Draft clear professional communication with an AI assistant and edit it to your own standard",
      "Plan, organise and track work using AI-supported productivity tools",
      "Research a topic and verify every claim before you use it",
      "Build a presentation that argues a position rather than lists facts",
      "Read, summarise and question a dataset without spreadsheet expertise"
    ],
    sessions: [
      {
        no: "01",
        title: "AI for Workplace Communication",
        tools: ["ChatGPT", "Microsoft Copilot"],
        objectives: [
          "Write emails, memos and replies that match tone and audience",
          "Use prompts that specify purpose, reader and length",
          "Edit AI drafts so the final voice is unmistakably yours"
        ]
      },
      {
        no: "02",
        title: "AI for Productivity",
        tools: ["ChatGPT", "Notion AI"],
        objectives: [
          "Turn a vague goal into a structured plan with tasks and dates",
          "Summarise meetings and long threads into actions",
          "Build a reusable workspace for notes, tasks and templates"
        ]
      },
      {
        no: "03",
        title: "AI for Research",
        tools: ["Perplexity", "Claude"],
        objectives: [
          "Frame a research question an AI tool can usefully answer",
          "Trace every answer back to a citable source",
          "Record a verification note alongside each finding"
        ]
      },
      {
        no: "04",
        title: "AI for Presentations & Pitch Decks",
        tools: ["Gamma", "Canva AI"],
        objectives: [
          "Shape a narrative arc before generating a single slide",
          "Generate and then edit a deck for clarity and pace",
          "Design slides that support the speaker rather than replace them"
        ]
      },
      {
        no: "05",
        title: "AI for Data Analysis",
        tools: ["ChatGPT", "Microsoft Copilot"],
        objectives: [
          "Describe, clean and question a small dataset",
          "Ask for the chart that answers your question, not the prettiest one",
          "Spot and challenge confident but wrong numerical claims"
        ]
      }
    ],
    status: "published"
  },
  {
    slug: "ai-for-content-creation",
    persona: "Youth",
    title: "AI for Content Creation",
    category: "02",
    description: "Write, script, record and produce content for real audiences across social, editorial, audio and video.",
    overview: "Five sessions that move from short social posts to full audio and video production. You build a body of published work for a real audience and learn where the AI helps, and where your own judgement has to take over.",
    tone: "bg-lilac",
    tier: "Basic",
    country: "Global",
    outcomes: [
      "Plan a content calendar around a defined audience",
      "Write long-form editorial that survives an honest edit",
      "Script and storyboard video before touching a camera",
      "Produce clean voice and podcast audio",
      "Assemble finished image and video pieces end to end"
    ],
    sessions: [
      {
        no: "06",
        title: "Social Media Content",
        tools: ["ChatGPT", "Canva AI"],
        objectives: [
          "Define an audience and a posting rhythm",
          "Generate platform-specific copy and matching visuals",
          "Repurpose one idea across several formats"
        ]
      },
      {
        no: "07",
        title: "Blog and Article Writing",
        tools: ["ChatGPT", "Claude"],
        objectives: [
          "Outline an article with a clear argument",
          "Draft, restructure and tighten with AI support",
          "Fact-check and attribute before publishing"
        ]
      },
      {
        no: "08",
        title: "Video Scripts and Storyboards",
        tools: ["ChatGPT", "Runway"],
        objectives: [
          "Write a script with a hook, body and close",
          "Break a script into shots and storyboard frames",
          "Generate reference footage for a concept"
        ]
      },
      {
        no: "09",
        title: "Voice, Audio and Podcasting",
        tools: ["ElevenLabs"],
        objectives: [
          "Produce natural synthetic narration",
          "Structure and edit a podcast episode",
          "Apply disclosure practice for synthetic voice"
        ]
      },
      {
        no: "10",
        title: "Image and Video Production",
        tools: ["Runway", "CapCut"],
        objectives: [
          "Generate and refine images to a brief",
          "Cut, caption and finish a short video",
          "Export correctly for each destination platform"
        ]
      }
    ],
    status: "published"
  },
  {
    slug: "ai-for-digital-publishing",
    persona: "Youth",
    title: "AI for Digital Publishing",
    category: "03",
    description: "Design and publish finished materials: print pieces, documents, e-books, web pages and a consistent brand system.",
    overview: "Five sessions on making things that get printed, downloaded or visited. You finish with a small publishing portfolio held together by one brand system you designed yourself.",
    tone: "bg-accent",
    tier: "Basic",
    country: "Global",
    outcomes: [
      "Design print-ready material with correct layout and typography",
      "Produce polished documents and presentation packs",
      "Structure and publish a long-form e-book",
      "Build and launch a landing page",
      "Hold everything together with a reusable brand system"
    ],
    sessions: [
      {
        no: "11",
        title: "Flyers and Print Design",
        tools: ["Canva AI"],
        objectives: [
          "Apply hierarchy, contrast and spacing to a single page",
          "Generate layout variations and choose deliberately",
          "Export print-ready files at the right size and bleed"
        ]
      },
      {
        no: "12",
        title: "Presentations and Documents",
        tools: ["Gamma", "Canva AI"],
        objectives: [
          "Convert raw notes into a structured document",
          "Keep typography and colour consistent across pages",
          "Produce a handout that reads without a presenter"
        ]
      },
      {
        no: "13",
        title: "E-books and Long-Form Publishing",
        tools: ["Claude", "Canva AI"],
        objectives: [
          "Plan chapters and a table of contents",
          "Draft and edit long-form text at a consistent voice",
          "Lay out and export a distributable e-book"
        ]
      },
      {
        no: "14",
        title: "Websites and Landing Pages",
        tools: ["ChatGPT", "Canva AI"],
        objectives: [
          "Write page copy that leads to one clear action",
          "Assemble a responsive page layout",
          "Publish and check the page on a phone"
        ]
      },
      {
        no: "15",
        title: "Brand Systems and Templates",
        tools: ["Canva AI", "Notion"],
        objectives: [
          "Define colour, type and voice rules",
          "Build reusable templates for recurring work",
          "Document the system so others can follow it"
        ]
      }
    ],
    status: "published"
  },
  {
    slug: "the-50-essential-ai-tools",
    persona: "Youth",
    title: "The 50 Essential AI Tools",
    category: "04",
    description: "A guided tour of fifty tools, how to compare them honestly, and how to decide which ones earn a place in your workflow.",
    overview: "Five sessions surveying the landscape: assistants, research tools, media tools and workflow tools. The course closes with a framework for choosing, comparing and retiring tools, so your stack stays small and deliberate.",
    tone: "bg-secondary",
    tier: "Basic",
    country: "Global",
    outcomes: [
      "Compare assistants on reasoning, tone and reliability",
      "Verify AI output with dedicated research tools",
      "Select the right media tool for a given brief",
      "Connect tools into a workflow rather than a collection",
      "Decide what to adopt and what to retire, and why"
    ],
    sessions: [
      {
        no: "16",
        title: "Assistants and Reasoning Tools",
        tools: ["ChatGPT", "Claude", "Gemini"],
        objectives: [
          "Run the same task across three assistants",
          "Judge output on accuracy, tone and usefulness",
          "Match assistant strengths to task types"
        ]
      },
      {
        no: "17",
        title: "Research and Verification Tools",
        tools: ["Perplexity"],
        objectives: [
          "Search with citations as the default expectation",
          "Cross-check a claim across independent sources",
          "Write the verification note that accompanies your work"
        ]
      },
      {
        no: "18",
        title: "Design and Media Tools",
        tools: ["Canva", "Runway", "ElevenLabs"],
        objectives: [
          "Map media tools to image, video and audio needs",
          "Assess output quality against a brief",
          "Understand licensing and disclosure for generated media"
        ]
      },
      {
        no: "19",
        title: "Productivity and Workflow Tools",
        tools: ["Notion AI", "Microsoft Copilot"],
        objectives: [
          "Automate a recurring task end to end",
          "Keep knowledge in one searchable place",
          "Measure whether the automation actually saved time"
        ]
      },
      {
        no: "20",
        title: "Choosing, Comparing and Retiring Tools",
        tools: ["Comparison framework"],
        objectives: [
          "Score tools against cost, fit and reliability",
          "Build a personal stack you can justify",
          "Retire tools that no longer earn their place"
        ]
      }
    ],
    status: "published"
  }
];

async function main() {
  console.log('Updating courses with full static data...');
  for (const c of staticCourses) {
    await prisma.course.upsert({
      where: { persona_slug: { persona: c.persona, slug: c.slug } },
      update: c,
      create: c,
    });
  }
  console.log('Done updating courses!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
