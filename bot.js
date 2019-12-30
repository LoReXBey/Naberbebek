const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
const Commando = require('discord.js-commando');
const Jimp = require("jimp");
const db = require("quick.db");
let kufurEngel = JSON.parse(
fs.readFileSync("./jsonlar/kufurEngelle.json", "utf8"));
const express = require('express');
const app = express();
const http = require('http');
    app.get("/", (request, response) => {
    console.log(` az önce pinglenmedi. Sonra ponglanmadı... ya da başka bir şeyler olmadı.`);
    response.sendStatus(200);
    });
    app.listen(process.env.PORT);
    setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 280000);
app.get('/foo', (req, res, next) => {
  const foo = JSON.parse(req.body.jsonString)
  // ...
})
process.on('unhandledRejection', (reason, promise) => {
  // Recommended: send the information to sentry.io
  // or whatever crash reporting service you use
})
require("./util/eventLoader")(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.on("guildMemberAdd", member => {
  const channel = member.guild.channels.find(ch => ch.name === "giriş-çıkış");
  if (!channel) return;
  channel.send(
    `Sunucumuza Hoşgeldin, **${member.user.tag}** :loudspeaker: Anlık Kullanıcı Sayımız:**${member.guild.memberCount}**`
  );
});

client.on("guildMemberRemove", member => {
  const channel = member.guild.channels.find(ch => ch.name === "giriş-çıkış");
  if (!channel) return;
  channel.send(
    `Aramızdan Ayrıldı, **${member.user.tag}** ::loudspeaker: :inbox_tray: Anlık Kullanıcı Sayımız:**${member.guild.memberCount}**`
  );
});

client.on("guildMemberAdd", member => {
  const channel = member.guild.channels.find(ch => ch.name === "ʀєɠɩƨƭєʀ-ơƒ-ƛʀєƛ");
  if (!channel) return;
  channel.send(
    `:inbox_tray:Aramıza Yeni Bir Üye Katıldı Hoş Geldin **${member.user.tag}** Yetkilileri Etiketliyerek Kayıt Olabilirsin! İyi Eylenceler`
  );
});

client.on("guildMemberRemove", member => {
  const channel = member.guild.channels.find(ch => ch.name === "sunucu");
  if (!channel) return;
  channel.send(
    `Aramızdan Ayrıldı, **${member.user.tag}** :confused: Anlık Kullanıcı Sayımız:**${member.guild.memberCount}**`
  );
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;

  let i = await db.fetch(`reklamFiltre_${msg.guild.id}`);
  if (i == "acik") {
    const reklam = [
      "discord.app",
      "discord.gg",
      "invite",
      "discordapp",
      "discordgg",
      ".com",
      ".net",
      ".xyz",
      ".tk",
      ".pw",
      ".io",
      ".me",
      ".gg",
      "www.",
      "https",
      "http",
      ".gl",
      ".org",
      ".com.tr",
      ".biz",
      ".party",
      ".rf.gd",
      ".az"
    ];
    if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
      try {
        if (!msg.member.hasPermission("MANAGE_GUILD")) {
          msg.delete();
          let embed = new Discord.RichEmbed()
            .setColor(0xffa300)
            .setFooter(
              "Pedro Blocker s  Reklam engellendi.",
              client.user.avatarURL
            )
            .setAuthor(
              msg.guild.owner.user.username,
              msg.guild.owner.user.avatarURL
            )
            .setDescription(
              "Pedro Reklam sistemi, " +
                `***${msg.guild.name}***` +
                " adlı sunucunuzda reklam yakaladım."
            )
            .addField(
              "Reklamı yapan kişi",
              "Kullanıcı: " + msg.author.tag + "\nID: " + msg.author.id,
              true
            )
            .addField("Engellenen mesaj", msg.content, true)
            .setTimestamp();
          msg.guild.owner.user.send(embed);
          return msg.channel
            .send(
              `<@${msg.author.id}> , :loudspeaker:Reklam Yapmak Yasak Bunu Bilmiyormusun :rage:`
            )
            .then(msg => msg.delete(3000));
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});



client.on("message", msg => {
  if (!msg.guild) return;
  if (!kufurEngel[msg.guild.id]) return;
  if (kufurEngel[msg.guild.id].küfürEngel === "kapali") return;
  if (kufurEngel[msg.guild.id].küfürEngel === "acik") {
    const kufur = [
      "fuck",
      "FUCK",
      "puşt",
      "oc",
      "PORN",
      "porn",
      "xnxx",
      "sex",
      "seks",
      "pic",
      "amk",
      "aq",
      "sik",
      "siktir",
      "a q",
      "a mk",
      "oç",
      "oruspu",
      "orusbu",
      "anan",
      "sikerler",
      "sikerim",
      "s1kerler",
      "s1kerim",
      "s1ker1m",
      "wtf",
      "AMK",
      "AQ",
      "ORUSBU",
      "ORUSPU",
      "SİKERLER",
      "GAY",
      "GÖT",
      "ANAN",
      "PORNHUB",
      "brazzers",
      "BRAZZERS",
      "ANANI",
      "ananı",
      "ananı sikerim",
      "ananı sik",
      "anamı sik",
      "ANANI SİK",
      "ANANI SİKERİM",
      "şerefsiz",
      "Şerefsiz",
      "ŞEREFSİZ",
      "orospu",
      "orospu çocuğu",
      "OC",
      "Piç",
      "PİÇ",
      "yavşak",
      "YAVŞAK",
      "ibne",
      "ipne",
      "İBNE",
      "İPNE",
      "amına korum",
      "pi.ç",
      "piç",
      "g0tten",
      "ananı",
      "skm",
      "p1c",
      "0c"
      
    ];
    if (kufur.some(word => msg.content.toLowerCase().includes(word))) {
      if (!msg.member.hasPermission("ADMINISTRATOR")) {
        msg.delete();
        msg
          .reply(":loudspeaker:Küfür Etmek Yasak Bunu Bilmiyormusun :rage:")
          .then(message => message.delete(3000));
      }
    }
  }
});


client.on("guildCreate", async guild => {
client.user.setActivity(`${ayarlar.prefix}yardım | ${client.guilds.size} Sunucu | ${client.users.size} Kullanıcı`, { type: 'Playing' });
  
  let guildCreateChannel = client.channels.get(ayarlar.eklendim);
  
  let general = guild.channels.find('name', 'genel,chat,sohbet');
  guild.channels.get(general.id).createInvite().then(invite => {
    
    let joinEmbed = new Discord.RichEmbed()
      .setTitle('Sunucuya Eklendim')
      .setThumbnail(guild.iconURL || `https://cdn.discordapp.com/embed/avatars/0.png`)
      .addField(invite.url || "Davet Alamadım")
      .setDescription('Yeni sunucuya giriş yaptım')
      .addField('Sunucu Bilgisi', `İsim: **${guild.name}** \nID: **${guild.id}**`)
      
    guildCreateChannel.send(joinEmbed);
  });
}); 

client.on("guildDelete", async guild => {
  client.user.setActivity(`${ayarlar.prefix}yardım | ${client.guilds.size} Sunucu | ${client.users.size} Kullanıcı`, { type: 'Playing' });
  
  let guildCreateDelete = client.channels.get(ayarlar.atıldım);
  
  let leaveEmbed = new Discord.RichEmbed()
    .setTitle('Sunucudan Atıldım')
    .setThumbnail(guild.iconURL || `https://cdn.discordapp.com/embed/avatars/0.png`)
    .addField('Sunucu Bilgisi', `İsim: **${guild.name}** \nID: **${guild.id}**`)
  
  guildCreateDelete.send(leaveEmbed);
});















const serverStats = {
  guildID: "SUNUCU ID",
  totalUsersID: "Toplam Kullanıcı Kanal ID",
  memberCountID: "Üye Sayısı Kanal ID",
  botCountID: "Bot Sayısı Kanal ID"
};

client.on("guildMemberAdd", member => {
  if (member.guild.id !== serverStats.guildID) return;

  client.channels
    .get(serverStats.totalUsersID)
    .setName(`Toplam Kullanıcı : ${member.guild.memberCount} `);
  client.channels
    .get(serverStats.memberCountID)
    .setName(
      `Üye Sayısı : ${member.guild.members.filter(m => !m.user.bot).size}`
    );
  client.channels
    .get(serverStats.botCountID)
    .setName(
      `Bot Sayısı : ${member.guild.members.filter(m => m.user.bot).size}`
    );
});

client.on("guildMemberRemove", member => {
  if (member.guild.id !== serverStats.guildID) return;

  client.channels
    .get(serverStats.totalUsersID)
    .setName(`Toplam Kullanıcı : ${member.guild.memberCount} `);
  client.channels
    .get(serverStats.memberCountID)
    .setName(
      `Üye Sayısı : ${member.guild.members.filter(m => !m.user.bot).size}`
    );
  client.channels
    .get(serverStats.botCountID)
    .setName(
      `Bot Sayısı : ${member.guild.members.filter(m => m.user.bot).size}`
    );
});

client.on("message", async message => {
  const ms = require("ms");
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  let rrrsembed = new Discord.RichEmbed();
  let u = message.mentions.users.first() || message.author;
  if (command === "sunucukur") {
    if (
      message.guild.channels.find(channel => channel.name === "Bot Kullanımı")
    )
      return message.channel.send(" Bot Paneli Zaten Ayarlanmış.");
    message.channel.send(
      `Bot Bilgi Kanallarının kurulumu başlatılsın mı? başlatılacak ise **evet** yazınız.`
    );
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        " Bu Kodu `Yönetici` Yetkisi Olan Kişi Kullanabilir."
      );
    message.channel
      .awaitMessages(response => response.content === "evet", {
        max: 1,
        time: 10000,
        errors: ["time"]
      })
      .then(collected => {
        message.guild.createChannel("|▬▬|Important Channels|▬▬|", "category", [
          {
            id: message.guild.id,
            deny: ["SEND_MESSAGES"]
          }
        ]);

        message.guild
          .createChannel("「📃」kurallar", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Important Channels|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「📢」duyuru-odası", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Important Channels|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「🚪」giriş-çıkış", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Important Channels|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「✅」sayaç", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Important Channels|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「💾」mod-log", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Important Channels|▬▬|"
              )
            )
          );
      })
      .then(collected => {
        message.guild.createChannel("|▬▬|General Channels|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`「💬」Sohbet`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|General Channels|▬▬|"
              )
            )
          );

        message.guild
          .createChannel(`「🔨」bot-komutları`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|General Channels|▬▬|"
              )
            )
          );

        message.guild
          .createChannel(`「📷」Foto-Chat`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|General Channels|▬▬|"
              )
            )
          );

        message.guild
          .createChannel(`「💡」şikayet-ve-öneri`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|General Channels|▬▬|"
              )
            )
          );

        message.guild.createChannel("|▬▬|Authorized Channels|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);
        message.guild
          .createChannel(`🏆》🌙 | Kurucu Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Authorized Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            let role2 = message.guild.roles.find("name", "🌙 | Kurucu");

            c.overwritePermissions(role, {
              CONNECT: false
            });
            c.overwritePermissions(role2, {
              CONNECT: true
            });
          });

        message.guild
          .createChannel(`🏆》🔰 | Yönetici Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Authorized Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            let role2 = message.guild.roles.find("name", "🌙 | Kurucu");
            let role3 = message.guild.roles.find("name", "🔰 | Yönetici");
            c.overwritePermissions(role, {
              CONNECT: false
            });
            c.overwritePermissions(role2, {
              CONNECT: true
            });
            c.overwritePermissions(role3, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`🏆》🔧 | Moderator Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Authorized Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            let role2 = message.guild.roles.find("name", "🌙 | Kurucu");
            let role3 = message.guild.roles.find("name", "🔰 | Yönetici");
            let role4 = message.guild.roles.find("name", "🔧 | Moderator");
            c.overwritePermissions(role, {
              CONNECT: false
            });
            c.overwritePermissions(role2, {
              CONNECT: true
            });
            c.overwritePermissions(role3, {
              CONNECT: true
            });
            c.overwritePermissions(role4, {
              CONNECT: true
            });
          });

        message.guild.createChannel("|▬▬|Audio Channels|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);
        message.guild
          .createChannel(`💬》Sohbet Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Audio Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`💬》Sohbet Odası2`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Audio Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`💬》Sohbet Odası3`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Audio Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`💬》Sohbet Odası4`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Audio Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`💬》Sohbet Odası5`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Audio Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`🎵》Müzik Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Audio Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`🎵》Müzik Odası2`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Audio Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`🎵》Müzik Odası3`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Audio Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`🎵》Müzik Odası4`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Audio Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`🎵》Müzik Odası5`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Audio Channels|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });

        message.guild.createChannel("|▬▬|Game Rooms|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`🎮》Serbest Oyun`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Game Rooms|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》ZULA`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Game Rooms|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》COUNTER STRİKE`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Game Rooms|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》FORTNİTE`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Game Rooms|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》LOL`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Game Rooms|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》MİNECRAFT`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Game Rooms|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》ROBLOX`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Game Rooms|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》WOLFTEAM`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Game Rooms|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》PUBG`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Game Rooms|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》UNTURNED`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|Game Rooms|▬▬|"
              )
            )
          );

        message.guild.createRole({
          name: "🌙 | Kurucu",
          color: "RED",
          permissions: ["ADMINISTRATOR"]
        });

        message.guild.createRole({
          name: "🔰 | Yönetici",
          color: "BLUE",
          permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES",
            "KICK_MEMBERS"
          ]
        });

        message.guild.createRole({
          name: "🔧 | Moderator",
          color: "GREEN",
          permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES"
          ]
        });

        message.guild.createRole({
          name: "💎Özel💎Vip💎Üye💎",
          color: "#fff700"
        });

        message.guild.createRole({
          name: "✔ | Özel Üye",
          color: "#030303"
        });

        message.guild.createRole({
          name: "⛳ | Üye",
          color: "#24ff00"
        });

        message.guild.createRole({
          name: "🌙 | Bot",
          color: "#00ffe5",
          permissions: ["ADMINISTRATOR"]
        });
        message.channel.send(
          "**Pedro Bot** Gerekli odaları kurdu! Bu kodu editleyen kişi: <xTolgaBey>"
        );
      });
  }
});











/////////OTOROL

client.on("guildMemberAdd", async member => {
  let log = await db.fetch(`otolog_${member.guild.id}`);
  let log2 = member.guild.channels.find(x => x.id === log);
  let rol = await db.fetch(`otorol_${member.guild.id}`);
  let otorol = member.guild.roles.find(x => x.id === rol);
  if (!log) return;
  if (!log2) return;
  if (!rol) return;
  if (!otorol) return;
  var embed = new Discord.RichEmbed()
  .setTitle(":loudspeaker: Sunucumuza Yeni Üye Katıldı:inbox_tray:")
  .setThumbnail(member.user.avatarURL || client.user.avatarURL)
  .setColor("GREEN")
  .setDescription(`**:inbox_tray: Sunucuya  Katılan** \`${member.user.username}\` **Adlı Kullanıcıya **<@&${rol}>**  **Rolü Verilmiştir**:diamond_shape_with_a_dot_inside:**`)
  .setFooter("Pedro Bot Otorol Sistem", client.user.avatarURL)
 
 log2.send(embed)
 //log2.send(`**:inbox_tray: Sunucuya Yeni Katılan** \`${member.user.uername}\` **Adlı Kullanıcıya **<@&${rol}>**  **Rolü Verilmiştir** :inbox_tray:**`)
  member.addRole(otorol)
});


////////////////<@&${rol}> **${member.user.username}**


client.on("guildMemberAdd", member => {
  let gc = JSON.parse(fs.readFileSync("./jsonlar/gc.json", "utf8"));
  const hgK = member.guild.channels.get(gc[member.guild.id].gkanal);
  if (!hgK) return;
  const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(
      member.user.tag,
      member.user.avatarURL || member.user.defaultAvatarURL
    )
    .setThumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
    .setTitle("Üye katıldı;")
    .setDescription(
      `:loudspeaker: :inbox_tray: *Sunucuya katıldı Toplam* [**${member.guild.memberCount} üyeyiz**]!:inbox_tray:` )
    .setFooter("Pedro Bot", client.user.avatarURL)
    .setTimestamp();
  hgK.send(embed);
});

client.on("guildMemberRemove", member => {
  let gc = JSON.parse(fs.readFileSync("./jsonlar/gc.json", "utf8"));
  const hgK = member.guild.channels.get(gc[member.guild.id].gkanal);
  if (!hgK) return;
  const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(
      member.user.tag,
      member.user.avatarURL || member.user.defaultAvatarURL
    )
    .setThumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
    .setTitle("Üye ayrıldı;")
    .setDescription(
      `:loudspeaker: :outbox_tray: *Sunucudan ayrıldı* [**${member.guild.memberCount} üye**]!:outbox_tray: `  )
    .setFooter("Pedro Bot", client.user.avatarURL)
    .setTimestamp();
  hgK.send(embed);
});


client.on("messageDelete", async message => {
  
  if (message.author.bot) return;
  
  var user = message.author;
  
  var kanal = await db.fetch(`modlogK_${message.guild.id}`)
  if (!kanal) return;
var kanal2 = message.guild.channels.find('name', kanal)  

  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Mesaj Silindi!`, message.author.avatarURL)
  .addField("Kullanıcı Tag", message.author.tag, true)
  .addField("ID", message.author.id, true)
  .addField("Silinen Mesaj", "```" + message.content + "```")
  .setThumbnail(message.author.avatarURL)
  kanal2.send(embed);
  
});

client.on("messageUpdate", async (oldMsg, newMsg) => {
  
  if (oldMsg.author.bot) return;
  
  var user = oldMsg.author;
  
  var kanal = await db.fetch(`modlogK_${oldMsg.guild.id}`)
  if (!kanal) return;
var kanal2 = oldMsg.guild.channels.find('name', kanal) 
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Mesaj Düzenlendi!`, oldMsg.author.avatarURL)
  .addField("Kullanıcı Tag", oldMsg.author.tag, true)
  .addField("ID", oldMsg.author.id, true)
  .addField("Eski Mesaj", "```" + oldMsg.content + "```")
  .addField("Yeni Mesaj", "```" + newMsg.content + "```")
  .setThumbnail(oldMsg.author.avatarURL)
  kanal2.send(embed);
  
});

client.on("roleCreate", async role => {
  
  var kanal = await db.fetch(`modlogK_${role.guild.id}`)
  if (!kanal) return;
var kanal2 = role.guild.channels.find('name', kanal)  

  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Rol Oluşturuldu!`, role.guild.iconURL)
  .addField("Rol", `\`${role.name}\``, true)
  .addField("Rol Rengi Kodu", `${role.hexColor}`, true)
  kanal2.send(embed);
  
});

client.on("roleDelete", async role => {
  
  var kanal = await db.fetch(`modlogK_${role.guild.id}`)
  if (!kanal) return;
var kanal2 = role.guild.channels.find('name', kanal)    

  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Rol Kaldırıldı!`, role.guild.iconURL)
  .addField("Rol", `\`${role.name}\``, true)
  .addField("Rol Rengi Kodu", `${role.hexColor}`, true)
  kanal2.send(embed);
  
});

client.on("roleUpdate", async role => {
  
  if (!log[role.guild.id]) return;
  
 var kanal = await db.fetch(`modlogK_${role.guild.id}`)
  if (!kanal) return;
var kanal2 = role.guild.channels.find('name', kanal) 
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Rol Güncellendi!`, role.guild.iconURL)
  .addField("Rol", `\`${role.name}\``, true)
  .addField("Rol Rengi Kodu", `${role.hexColor}`, true)
  kanal2.send(embed);
  
});

client.on('voiceStateUpdate', async (oldMember, newMember) => {
  
  
  
  var kanal = await db.fetch(`modlogK_${oldMember.guild.id}`)
  if (!kanal) return;
var kanal2 = oldMember.guild.channels.find('name', kanal) 
  
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel

  if(oldUserChannel === undefined && newUserChannel !== undefined) {

    const embed = new Discord.RichEmbed()
    .setColor("GREEN")
    .setDescription(`**${newMember.user.tag}** adlı kullanıcı \`${newUserChannel.name}\` isimli sesli kanala giriş yaptı!`)
    kanal2.send(embed);
    
  } else if(newUserChannel === undefined){

    const embed = new Discord.RichEmbed()
    .setColor("RED")
    .setDescription(`**${newMember.user.tag}** adlı kullanıcı bir sesli kanaldan çıkış yaptı!`)
    kanal2.send(embed);
    
  }
  
  client.on('channelCreate', async (channel,member) => {
let gc = JSON.parse(fs.readFileSync("./jsonlar/log.json", "utf8"));
  const hgK = member.guild.channels.get(gc[member.guild.id].gkanal)
    if (!hgK) return;
		if (!channel.guild) return;
			if (channel.type === "text") {
				var embed = new Discord.RichEmbed()
				.setColor(3066993)
				.setAuthor(channel.guild.name, channel.guild.iconURL)
				.setDescription(`<#${channel.id}> kanalı oluşturuldu. _(metin kanalı)_`)
				.setFooter(`ID: ${channel.id}`)
				embed.send(embed);
			};
			if (channel.type === "voice") {
				var embed = new Discord.RichEmbed()
				.setColor(3066993)
				.setAuthor(channel.guild.name, channel.guild.iconURL)
				.setDescription(`${channel.name} kanalı oluşturuldu. _(sesli kanal)_`)
				.setFooter(`ID: ${channel.id}`)
				hgK.send({embed});
			}
		
	})
		
	client.on('channelDelete', async channel => {
		    const fs = require('fs');
let gc = JSON.parse(fs.readFileSync("./jsonlar/log.json", "utf8"));
  
  const hgK = channel.guild.channels.get(gc[channel.guild.id].gkanal)
    if (!hgK) return;
			if (channel.type === "text") {
				let embed = new Discord.RichEmbed()
				.setColor(3066993)
				.setAuthor(channel.guild.name, channel.guild.iconURL)
				.setDescription(`${channel.name} kanalı silindi. _(metin kanalı)_`)
				.setFooter(`ID: ${channel.id}`)
				hgK.send({embed});
			};
			if (channel.type === "voice") {
				let embed = new Discord.RichEmbed()
				.setColor(3066993)
				.setAuthor(channel.guild.name, channel.guild.iconURL)
				.setDescription(`${channel.name} kanalı silindi. _(sesli kanal)_`)
				.setFooter(`ID: ${channel.id}`)
				hgK.send({embed});
			}
		
	});
  
});


const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new YouTube("AIzaSyAXpo6_ipn_i_nYO1SXVOWRrB4DgIf7-9g");
const queue = new Map();

client.on("ready", async () => {
  console.log(`${client.user.tag} Müzik Girişi Yapıldı!`);
});

client.on("message", async message => {
  if (message.author.bot) return;

  var prefix = ayarlar.prefix;
  var args = message.content.substring(prefix.length).split(" ");
  if (!message.content.startsWith(prefix)) return;
  var searchString = args.slice(1).join(" ");
  var url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  var serverQueue = queue.get(message.guild.id);
  switch (args[0].toLowerCase()) {
    case "play":
      if (!searchString)
        return message.channel.send(":x: | Bir Şarkı Girmelisin");
      var voiceChannel = message.member.voiceChannel;
      if (!voiceChannel)
        return message.channel.send(
          `:x: | Lütfen herhangi bir sesli kanala katılınız.`
        );
      var permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT"))
        return message.channel.send(
          `:x: | Herhangi bir sesli kanala katılabilmek için yeterli iznim yok.`
        );
      if (!permissions.has("SPEAK"))
        return message.channel.send(`:x: | Sunucuda Konuşma Yetkim Yok`);

      if (
        url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)
      ) {
        var playlist = await youtube.getPlaylist(url);
        var videos = await playlist.getVideos();
        for (const video of Object.values(videos)) {
          var video2 = await youtube.getVideoByID(video.id);
          await handleVideo(video2, message, voiceChannel, true);
        }
        return message.channel.send(
          `▶ **${playlist.title}** İsimli şarkı oynatma listesine Eklendi.`
        );
      } else {
        try {
          var video = await youtube.getVideo(url);
        } catch (error) {
          try {
            var videos = await youtube.searchVideos(searchString, 10);
            var index = 0;
            const embed = new Discord.RichEmbed()
              .setColor("RANDOM")
              .setTitle(`**Şarkı Seç**`)
              .setDescription(
                `${videos
                  .map(video2 => `**${++index} -** ${video2.title}`)
                  .join(
                    "\n"
                  )} \n\n**Lütfen hangi şarkıyı seçmek istiyorsan başındaki sayı numarasını yaz.**`
              )
              .setFooter(`Şarkı seçimi "10" saniye içinde iptal edilecektir.`);
            message.channel.send({ embed });
            try {
              var number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
              const filter = res => {
                const value = res.content.toLowerCase();
                return (
                  res.author.id === message.author.id &&
                  !number.some(word => message.content.includes(word))
                );
              };
              var response = await message.channel.awaitMessages(filter, {
                maxMatches: 1,
                time: 10000,
                errors: ["time"]
              });
            } catch (err) {
              console.error(err);
              return message.channel.send(
                `:x: | Açmam Gereken Şarkının Numarasını Girmediniz.`
              );
            }
            const videoIndex = parseInt(response.first().content);
            var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
          } catch (err) {
            console.error(err);
            return message.channel.send(
              `Youtube üzerinde bu isimde bir şarkı bulunamadı`
            );
          }
        }
        return handleVideo(video, message, voiceChannel);
      }
      break;
    case "skip":
      if (!message.member.voiceChannel)
        return message.channel.send(`:x: | Bot ile aynı kanalda değilsiniz.`);
      if (!serverQueue)
        return message.channel.send(
          `:x: | Şuanda sunucuda herhangi bir şarkı çalmıyor.`
        );
      serverQueue.connection.dispatcher.end("g");
      message.channel.send(`:white_check_mark: | Şarkı başarıyla geçildi.`);
      return undefined;

      break;
    case "durdur":
      if (!message.member.voiceChannel)
        return message.channel.send(`:x: | Bot ile aynı kanalda değilsiniz.`);
      if (!serverQueue)
        return message.channel.send(
          `:x: | Şuanda sunucuda herhangi bir şarkı çalmıyor.`
        );
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end("d");
      message.channel.send(
        `:white_check_mark: | Şarkı kapatıldı, oynatma listesi temizlendi.`
      );
      return undefined;
      break;
    case "ses":
      if (!message.member.voiceChannel)
        return message.channel.send(`:x: | Bot ile aynı kanalda değilsiniz.`);
      if (!serverQueue)
        return message.channel.send(
          `:x: | Şuanda sunucuda herhangi bir şarkı çalmıyor.`
        );
      var number = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        91,
        92,
        93,
        94,
        95,
        96,
        97,
        98,
        99,
        100
      ];
      if (args[1] && !number.some(word => message.content.includes(word)))
        return message.channel.send(
          `:x: | Ayarlayacağınız Ses Seiyesi 0-100 arasında olmak zorundadır`
        );
      if (!args[1])
        return message.channel.send(
          `Şuanki Ses Seviyesi: **%${serverQueue.volume}**`
        );
      serverQueue.volume = args[1];
      if (args[1] > 100)
        return message.channel.send(
          `Ses seviyesi en fazla 100 olarak ayarlanabilir.`
        );
      serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 20);
      return message.channel.send(`Ayarlanan Ses Seviyesi: **%${args[1]}**`);
      break;
    case "oynatılan":
      if (!serverQueue)
        return message.channel.send(
          `:x: | Şuanda sunucuda herhangi bir şarkı çalmıyor.`
        );
      return message.channel.send(
        new Discord.RichEmbed()
          .setTitle("Şu Anda Çalan Şarkı")
          .addField(
            "Başlık",
            `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`
          )
          .addField(
            "Süre",
            `${serverQueue.songs[0].durationm}:${serverQueue.songs[0].durations}`
          )
      );
      break;
    case "kuyruk":
      var siralama = 0;
      if (!serverQueue)
        return message.channel.send(
          `:x: | Şuanda sunucuda herhangi bir şarkı çalmıyor.`
        );
      const songList10 = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField(`🎶 | Şuanda Oynatılan`, `${serverQueue.songs[0].title}`)
        .addField(
          `▶ | Şarkı Kuyruğu`,
          `${serverQueue.songs.map(song => `**-** ${song.title}`).join("\n")}`
        );

      return message.channel.send(songList10);
      break;
    case "stop":
      if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return message.channel.send(
          `:white_check_mark: | Şarkı başarıyla duraklatıldı.`
        );
      }
      return message.channel.send(
        `:x: | Şuanda sunucuda herhangi bir şarkı çalmıyor.`
      );
      break;
    case "devamet":
      if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return message.channel.send(
          `:white_check_mark: | Şarkı başarıyla devam ettiriliyor...`
        );
      }
      return message.channel.send(
        `:x: | Şuanda sunucuda herhangi bir şarkı çalmıyor.`
      );

      return undefined;
      break;
  }
  async function handleVideo(video, message, voiceChannel, playlist = false) {
    var serverQueue = queue.get(message.guild.id);
    //console.log(video);
    var song = {
      id: video.id,
      title: video.title,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
      requester: message.author.id,
      durationh: video.duration.hours,
      durationm: video.duration.minutes,
      durations: video.duration.seconds,
      views: video.views
    };
    if (!serverQueue) {
      var queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 25,
        playing: true
      };
      queue.set(message.guild.id, queueConstruct);

      queueConstruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(message.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.error(`Ses kanalına giremedim HATA: ${error}`);
        queue.delete(message.guild.id);
        return message.channel.send(`Ses kanalına giremedim HATA: ${error}`);
      }
    } else {
      serverQueue.songs.push(song);
      //console.log(serverQueue.songs);
      if (playlist) return undefined;
      return message.channel.send(
        `**${song.title}** adlı şarkı kuyruğa eklendi.`
      );
    }
    return undefined;
  }
  function play(guild, song) {
    var serverQueue = queue.get(guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    //console.log(serverQueue.songs);

    if (serverQueue.end) return;

    const dispatcher = serverQueue.connection
      .playStream(ytdl(song.url))
      .on("end", reason => {
        if (reason !== "d" && reason !== "g") {
          message.channel.send(":white_check_mark: | Çalınan Şarkı Sona Erdi!");
          serverQueue.songs.shift();
          play(guild, serverQueue.songs[0]);
        }
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 25);

    const playingBed = "**" + song.title + "** adlı şarkı oynatılıyor";
    serverQueue.textChannel.send(playingBed);
  }
});

client.on("guildMemberAdd", async member => {
  let tag = await db.fetch(`tag_${member.guild.id}`);
  let tagyazi;
  if (tag == null) tagyazi = member.setNickname(`${member.user.username}`);
  else tagyazi = member.setNickname(`${tag} | ${member.user.username}`);
});

client.on(`guildMemberAdd`, async member => {
  const e = new Discord.RichEmbed()
    .setColor(`RANDOM`)
    .setImage(`https://media.giphy.com/media/PjBhcOypzsTRfv7bKr/giphy.gif`)
    .addField(
      `Sunucumuza geldiğin için teşekkür ederim!`,
      `Pedro iyi eğlenceler diler`
    )
    .addField(
      `Davet Linkleri;`,
      `[Botu Sunucuna Eklemek için Tıkla](https://discordapp.com/oauth2/authorize?client_id=579772484497178645&scope=bot&permissions=2080898303)\n[Botun Destek Sunucusu](https://discord.gg/MHVydw7)`
    )
    .setFooter(`Bu Sunucu 7/24 Pedro Bot  tarafından korunuyor.`);
  member.send(e);
});

client.on("message", async msg => {
  if (msg.content.toLowerCase() === "sa") {
    await msg.react("🇦");
    msg.react("🇸");
    msg.reply("Aleyküm Selam Hoşgeldin!");
  }
});

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);
client.on('message', async msg => {
    if (msg.content.toLowerCase() === prefix + "disko") {
msg.channel.send('**Eğer *__disko__* Adlı Bir Rol Oluşturduysanız Şu Andan İtibaren O Rolün Rengi Sürekli Değişecektir! Eğer *__disko__* Rolü Oluşturulmadıysa Hiçbir Rolün Rengi Değişmeyecektir.**');
   if (msg.channel.type === "dm") return;
  const rol = '👑 | GOD' // Rol ismi buraya yazılacak. Örnek Olarak Buraya Kurucu Yazarsak Kurucu Rolünün Rengi Sürekli Değişir //
  setInterval(() => {
      msg.guild.roles.find(s => s.name === rol).setColor("RANDOM")
      }, 1000);
  }
});