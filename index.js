const axios = require("axios");
const dotenv = require("dotenv");
const { Composer, Markup, Scenes, session, Telegraf } = require("telegraf");
const fs = require("fs");

dotenv.config();

// tg bot get chat id
const getChatId = async (message) => {
	const chatId = message.chat.id;
	return chatId;
};

const TOKEN = process.env.BOT_TOKEN;
(CHAT_ID = "2126810553"),
	(BASE_URL = "api.telegram.org"),
	(REQUEST_FREQUENCY = 5000);

const postFile = async (filePath) => {
	const formData = new FormData();
	formData.append("content", fs.createReadStream(filePath));
	const response = await axios.put(
		"https://api.github.com/repos/rivertwilight/cargo-plane-bot/test/test_post.md"
	);
	return response;
};

const getFilePath = (fileId, callback) => {
	axios
		.get(`https://${BASE_URL}/bot${TOKEN}/getFile?file_id=${fileId}`)
		.then((res) => {
			callback(res.data.result.file_path);
		})
		.catch(console.log);
};

const keyboard = Markup.inlineKeyboard([
	Markup.button.callback("Github", "send_to_github"),
	Markup.button.callback("Notion", "send_to_notion"),
]);

// Handler factories
const { enter, leave } = Scenes.Stage;

// Greeter scene
const githubScene = new Scenes.BaseScene("githubScene");
githubScene.fileId = "";

githubScene.enter((ctx) => {});
githubScene.leave((ctx) => ctx.reply("Bye"));
// githubScene.on("help", enter("greeter"));
githubScene.on("text", (ctx) => {
	// if (
	// 	ctx.message &&
	// 	!ctx.message.text.match(/[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+/i)
	// ) {
	// 	ctx.reply("Please enter a valid repo link");
	// } else {
	ctx.reply(`save ${githubScene.fileId} to ${ctx.message.text}`);
	getFilePath(githubScene.fileId, (filePath) => {
		console.log(filePath);
		postFile(`https://${BASE_URL}/bot${TOKEN}/$${filePath}`, (res) => {
			console.log(res);
		});
	});
	// }
});

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([githubScene], {
	ttl: 10,
});
bot.use(session());
bot.use(stage.middleware());
bot.use((ctx, next) => {
	// we now have access to the the fields defined above
	ctx.fileId = "";
	return next();
});

bot.on("document", (ctx) => {
	githubScene.fileId = ctx.message.document.file_id;
	ctx.reply("Where do you what to send to?", keyboard);
});

bot.action("send_to_github", (ctx) => {
	ctx.scene.enter("githubScene");
	ctx.replyWithMarkdownV2(
		"Please send me the path you want to save to in this format: `<owner>/<repo>/<path>/<filename>`"
	);
	ctx.deleteMessage();
});

bot.launch();

// Enable graceful stop
// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
