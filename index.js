const mineflayer = require("mineflayer");

function createBot() {
  const bot = mineflayer.createBot({
    host: "currysquadserver.aternos.me",
    port: 48590,
    username: "BotName",
    version: "1.20.4",
    auth: "offline",
  });

  bot.once("spawn", () => {
    console.log("✅ Bot spawned! Switching to spectator mode...");
    setTimeout(() => {
      bot.chat("/gamemode spectator");
    }, 3000);
  });

  bot.on("end", () => {
    console.log("🔁 Bot disconnected. Reconnecting in 5 seconds...");
    setTimeout(createBot, 5000);
  });

  bot.on("error", (err) => {
    console.log("❌ Error:", err);
  });

  // Random look and movement loop
  function randomLookMove() {
    if (!bot.entity) return;

    const yaw = Math.random() * Math.PI * 2;
    bot.look(yaw, 0, true);
    console.log("👀 Bot adjusted view.");

    const controls = ["forward", "back", "left", "right"];
    const move = controls[Math.floor(Math.random() * controls.length)];

    bot.setControlState(move, true);
    console.log(`🚶 Bot started moving ${move}.`);

    const moveDuration = 2000 + Math.random() * 3000; // 2-5 seconds
    setTimeout(() => {
      bot.setControlState(move, false);
      console.log(`🛑 Bot stopped moving ${move}.`);
    }, moveDuration);

    // 30% chance to jump
    if (Math.random() < 0.3) {
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 500);
      console.log("⏫ Bot jumped");
    }

    // Schedule next random look/move 0-15 seconds later
    const nextTime = Math.random() * 15000;
    setTimeout(randomLookMove, nextTime);
  }

  // Start first random look/move
  setTimeout(randomLookMove, 3000);

  // Panic mode on entity hurt
  bot.on("entityHurt", (entity) => {
    if (entity.username === bot.username) {
      console.log("😱 I GOT HIT - entering panic mode!");

      const panicTime = Date.now() + 5000; // 5 seconds panic
      const panicInterval = setInterval(() => {
        if (Date.now() > panicTime) {
          clearInterval(panicInterval);
          bot.setControlState("forward", false);
          return;
        }

        const yaw = Math.random() * Math.PI * 2;
        bot.look(yaw, 0, true);

        const controls = ["forward", "back", "left", "right"];
        const move = controls[Math.floor(Math.random() * controls.length)];

        controls.forEach(c => bot.setControlState(c, false));
        bot.setControlState(move, true);
      }, 500);
    }
  });

  // Random teleport to players every 0-15 seconds
  function randomTeleportToPlayer() {
    if (!bot.entity) return;

    const players = Object.values(bot.players).filter(p => p.entity && p.username !== bot.username);
    if (players.length > 0) {
      const target = players[Math.floor(Math.random() * players.length)];
      bot.chat(`/tp ${target.username}`);
      console.log(`🧍 Teleporting to player ${target.username}`);
    }

    const nextTime = Math.random() * 15000;
    setTimeout(randomTeleportToPlayer, nextTime);
  }
  setTimeout(randomTeleportToPlayer, 5000);

  // Random teleport to random coords every 0-15 seconds
  function randomTeleportCoords() {
    if (!bot.entity) return;

    const dx = (Math.random() - 0.5) * 30;
    const dy = (Math.random() - 0.5) * 30;
    const dz = (Math.random() - 0.5) * 30;

    const pos = bot.entity.position.offset(dx, dy, dz);
    bot.chat(`/tp ${pos.x.toFixed(1)} ${pos.y.toFixed(1)} ${pos.z.toFixed(1)}`);

    console.log(`🧭 Teleporting randomly to (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`);

    const nextTime = Math.random() * 15000;
    setTimeout(randomTeleportCoords, nextTime);
  }
  setTimeout(randomTeleportCoords, 7000);
}

createBot();
