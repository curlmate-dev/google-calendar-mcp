import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import z from "zod";
import { EventSchema } from "./event-schema";

const zAccessTokenResponse = z.object({
  accessToken: z.string()
})

const CURLMATE_BASE_URL = "https://api.curlmate.dev";

const getAccessToken = async({ jwt, connection }: { jwt: string | undefined, connection: string | undefined }): Promise<{accessToken: string} | { error: string, status: number }> => {
  if (!jwt) {
    return {
      error: "JWT is missing in request headers",
      status: 401   
    }
  }
  
  if (!connection) {
    return {
      error: "Connection is missing in request headers",
      status: 400   
    }
  }

  const res = await fetch(`${CURLMATE_BASE_URL}/token`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
      "x-connection": connection  
    }
  })

  if (!res.ok) {
    return {
      error: await res.text(),
      status: res.status,
    }
  }

  const { accessToken } = zAccessTokenResponse.parse(await res.json())
  return { accessToken }
}

export class GoogleCalendarMCP extends McpAgent<Env, {}> {
  server = new McpServer({
    name: "google-calendar-remote-mcp",
    version: "0.0.1",
  });


  
  async init() {
    this.server.registerTool(
      "List-All-Calendars",
      {
        description: "this tool lists all Calendars of User",
        inputSchema: { }
      },
      async ({ }, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const res = await getAccessToken({ jwt, connection });
        if ("error" in res) {
          return {
            content: [
              {
                text: JSON.stringify(res),
                type: "text",
              }
            ]

          }
        }
        const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${res.accessToken}`,
            "Content-Type": "application/json",
          }
        })

        if (!response.ok) {
          return {
            content: [
              {
                text: JSON.stringify(await response.text()),
                type: "text"
              }
            ]
          }
        }

        return {
          content: [
            {
              text: JSON.stringify(await response.json()),
              type: "text"
            }
          ]
        };
      }
    );

    this.server.registerTool(
      "Get-a-calnedar",
      {
        description: "this tool gets a Calendars of User",
        inputSchema: { calendarId: z.string()}
      },
      async ({ calendarId }, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const res = await getAccessToken({ jwt, connection });
        if ("error" in res) {
          return {
            content: [
              {
                text: JSON.stringify(res),
                type: "text",
              }
            ]

          }
        }
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${res.accessToken}`,
            "Content-Type": "application/json",
          }
        })

        if (!response.ok) {
          return {
            content: [
              {
                text: JSON.stringify(await response.text()),
                type: "text"
              }
            ]
          }
        }

        return {
          content: [
            {
              text: JSON.stringify(await response.json()),
              type: "text"
            }
          ]
        };
      }
    );
    this.server.registerTool(
      "Get-Events-from-calendar",
      {
        description: "this tool gets events of a Calendar ",
        inputSchema: { calendarId: z.string()}
      },
      async ({ calendarId }, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const res = await getAccessToken({ jwt, connection });
        if ("error" in res) {
          return {
            content: [
              {
                text: JSON.stringify(res),
                type: "text",
              }
            ]

          }
        }
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${res.accessToken}`,
            "Content-Type": "application/json",
          }
        })

        if (!response.ok) {
          return {
            content: [
              {
                text: JSON.stringify(await response.text()),
                type: "text"
              }
            ]
          }
        }

        return {
          content: [
            {
              text: JSON.stringify(await response.json()),
              type: "text"
            }
          ]
        };
      }
    );
    this.server.registerTool(
      "Create-event-in-calendar",
      {
        description: "this tool creates events of a Calendar ",
        inputSchema: { calendarId: z.string(), body: z.record(z.string(), z.union([z.string(), z.unknown()]))}
      },
      async ({ calendarId, body }, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const res = await getAccessToken({ jwt, connection });
        if ("error" in res) {
          return {
            content: [
              {
                text: JSON.stringify(res),
                type: "text",
              }
            ]

          }
        }
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${res.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body)
        })

        if (!response.ok) {
          return {
            content: [
              {
                text: JSON.stringify(await response.text()),
                type: "text"
              }
            ]
          }
        }

        return {
          content: [
            {
              text: JSON.stringify(await response.json()),
              type: "text"
            }
          ]
        };
      }
    );
    this.server.registerTool(
      "sample-event-resource-for-request-body-create-event",
      {
        description: "this tool responds with a event type",
        inputSchema: { }
      },
      async ({}, { requestInfo }) => {
        return {
          content: [
            {
              text: JSON.stringify(EventSchema),
              type: "text"
            }
          ]
        };
      }
    );

    this.server.registerTool(
      "authenticated-user",
      {
        description: "this tool lists the authenticated user",
        inputSchema: { }
      },
      async ({}, {requestInfo}) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const res = await getAccessToken({ jwt, connection });
        if ("error" in res) {
          return {
            content: [
              {
                text: JSON.stringify(res),
                type: "text",
              }
            ]

          }
        }
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${res.accessToken}`,
            "Content-Type": "application/json",
          }
        })

        if (!response.ok) {
          return {
            content: [
              {
                text: JSON.stringify(await response.text()),
                type: "text"
              }
            ]
          }
        }

        return {
          content: [
            {
              text: JSON.stringify(await response.json()),
              type: "text"
            }
          ]
        };
      }
    );
  }

  
  onError(_: unknown, error?: unknown): void | Promise<void> {
    console.error("GoogleCalendarMCP initialization error:", error);

    // Provide more specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes("counter")) {
        console.error(
          "Failed to initialize counter resource. Please check the counter configuration."
        );
      } else if (error.message.includes("tool")) {
        console.error(
          "Failed to register MCP tools. Please verify tool configurations."
        );
      } else {
        // Fall back to default error handling
        console.error(error);
      }
    }
  }
}

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // support both legacy SSE and new streamable-http
    if (url.pathname.startsWith("/sse")) {
      return GoogleCalendarMCP.serveSSE("/sse", { binding: "GoogleCalendarMCP" }).fetch(
        request,
        env,
        ctx
      );
    }

    if (url.pathname.startsWith("/mcp")) {
      return GoogleCalendarMCP.serve("/mcp", { binding: "GoogleCalendarMCP" }).fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  }
};
