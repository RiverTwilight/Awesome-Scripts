const axios = require("axios");
const dotenv = require("dotenv");
const { Telegraf, Markup } = require("telegraf");

dotenv.config();

// tg bot get chat id
const getChatId = async (message) => {
	const chatId = message.chat.id;
	return chatId;
};

const TOKEN = process.env.TG_TOKEN;
(CHAT_ID = "2126810553"),
	(BASE_URL = "api.telegram.org"),
	(REQUEST_FREQUENCY = 5000);

const postFile = async (filePath) => {
	const chatId = await getChatId(message);
	const url = `https://${BASE_URL}/bot${TOKEN}/sendDocument`;
	const formData = new FormData();
	formData.append("chat_id", chatId);
	formData.append("document", fs.createReadStream(filePath));
	const response = await axios.post(url, formData);
	axios.put(
		"https://api.github.com/repos/rivertwilight/{repo}/contents/{path}"
	);
	return response;
};

const getFilePath = (fileId, callback) => {
	axios
		.get(`https://${BASE_URL}/bot${TOKEN}/getFile?file_id=${fileId}`)
		.then((res) => {
			callback(res.data.result.file_path);
		});
};

const getUpdate = () => {
	axios
		.get(`https://${BASE_URL}/bot${TOKEN}/getUpdates`)
		.then((res) => {
			res.data.result.map(({ message }) => {
				console.log(message);
				if (message.document) {
					getFilePath(message.document.file_id, (filePath) => {
						console.log(filePath);
						postFile(filePath);
					});
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

const keyboard = Markup.inlineKeyboard([
	Markup.button.callback("Github", "send_to_github"),
	Markup.button.callback("Notion", "send_to_notion"),
]);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
	ctx.reply("Welcome to the bot!");
});

bot.help((ctx) => ctx.reply("Send me a sticker"));

bot.on("document", (ctx) => {
	ctx.reply("Where do you what to send to?", keyboard);
});

bot.action("send_to_github", (ctx) => {
	ctx.deleteMessage();
	getFilePath(message.document.file_id, (filePath) => {
		console.log(filePath);
		postFile(filePath);
	});
});

bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();
