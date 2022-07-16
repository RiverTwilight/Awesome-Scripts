const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// tg bot get chat id
const getChatId = async (message) => {
	const chatId = message.chat.id;
	return chatId;
};

const TOKEN = process.env.TG_TOKEN;
(CHAT_ID = "2126810553"), (BASE_URL = "api.telegram.org");

const postFile = async (filePath) => {
	const chatId = await getChatId(message);
	const url = `https://${BASE_URL}/bot${TOKEN}/sendDocument`;
	const formData = new FormData();
	formData.append("chat_id", chatId);
	formData.append("document", fs.createReadStream(filePath));
	const response = await axios.post(url, formData);
	return response;
};

// tg bot get new message
(function main() {
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
})();

const getFilePath = (fileId, callback) => {
	axios
		.get(`https://${BASE_URL}/bot${TOKEN}/getFile?file_id=${fileId}`)
		.then((res) => {
			callback(res.data.result.file_path);
		});
};
