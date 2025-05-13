export async function GET() {
  return Response.json({ 
    status: "ok",
    auth: process.env.NEXTAUTH_URL,
    db: !!process.env.DATABASE_URL
  });
}