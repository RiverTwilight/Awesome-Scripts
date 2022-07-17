const axios = require("axios");
const dotenv = require("dotenv");
const { Composer, Markup, Scenes, session, Telegraf } = require("telegraf");
const fs = require("fs");
const https = require("https"); // or 'https' for https:// URLs

dotenv.config();

const TOKEN = process.env.BOT_TOKEN;
(CHAT_ID = "2126810553"),
	(BASE_URL = "api.telegram.org"),
	(REQUEST_FREQUENCY = 5000);

const postFile = async (filePath, fileName) => {
	axios.get(filePath).then((res) => {
		const base64 = Buffer.from(res.data, "binary").toString("base64");

		axios({
			url: "https://api.github.com/repos/rivertwilight/cargo-plane-bot/contents/test/test_post.md",
			method: "PUT",
			headers: {
				Authorization: `token ${process.env.GITHUB_TOKEN}`,
			},
			data: {
				content: base64,
				message: `Add ${fileName} via Telegram`,
				committer: {
					name: "River Twilight",
					email: "",
				},
			},
		})
			.then((res) => {
				console.log(res.data.errors);
			})
			.catch((err) => {
				console.log(err);
			});
	});

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
		postFile(
			`https://${BASE_URL}/file/bot${TOKEN}/${filePath}`,
			"test_post.md",
			(res) => {
				console.log(res);
			}
		);
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
