export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 投稿一覧
    if (request.method === "GET" && url.pathname === "/api/posts") {
      const { results } = await env.DB.prepare(
        "SELECT id, message, likes, created_at FROM posts ORDER BY id DESC LIMIT 100"
      ).all();

      return Response.json(results);
    }

    // 投稿
    if (request.method === "POST" && url.pathname === "/api/posts") {
      const body = await request.json();
      const message = String(body.message || "").trim();

      if (!message || message.length > 1000) {
        return Response.json(
          { error: "投稿内容が不正です" },
          { status: 400 }
        );
      }

      await env.DB.prepare(
        "INSERT INTO posts (message) VALUES (?)"
      ).bind(message).run();

      return Response.json({ success: true });
    }

    return env.ASSETS.fetch(request);
  }
};
