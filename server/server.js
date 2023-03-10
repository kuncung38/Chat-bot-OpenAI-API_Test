import express from "express";

import * as dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

const port = process.env.port || 3000;

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", async (req, res) => {
	res.status(200).json({
		message: "Hello from CodeX",
	});
});

app.post("/", async (req, res) => {
	try {
		const prompt = req.body.prompt;

		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: `${prompt}`,
			temperature: 0,
			max_tokens: 3000,
			top_p: 1,
			frequency_penalty: 0.5,
			presence_penalty: 0,
		});

		res.status(200).json({
			bot: response.data.choices[0].text,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

app.listen(port, () => {
	console.log(`server is running on port ${port}`);
});
