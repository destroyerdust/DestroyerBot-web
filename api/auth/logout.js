export default async function handler(req, res) {
  // Clear cookies
  res.setHeader('Set-Cookie', [
    `discord_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    `discord_user=; Path=/; SameSite=Lax; Max-Age=0`
  ]);

  res.redirect('/');
}
