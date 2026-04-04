export type AppSession = {
  user: {
    name: string;
    email: string;
  };
};

export async function getRequiredSession(): Promise<AppSession> {
  return {
    user: {
      name: "Frank Ortega",
      email: "frank@example.com"
    }
  };
}
