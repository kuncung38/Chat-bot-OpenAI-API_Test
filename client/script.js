import "./style.css";
import bot from "./assets/bot.svg";
import user from "/assets/user.svg";

const origin = `http://localhost:3000`;

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;
function loader(el) {
	el.textContent = "";

	loadInterval = setInterval(() => {
		el.textContent += ".";

		if (el.textContent === "...") {
			el.textContent = "";
		}
	}, 300);
}

function typeText(el, text) {
	let index = 0;
	let interval = setInterval(() => {
		if (index < text.length) {
			el.innerHTML += text.charAt(index);
			index++;
		} else {
			clearInterval(interval);
		}
	}, 20);
}

function generateUniqueId() {
	const timeStamp = Date.now();
	const randomNumber = Math.random();
	const hexadecimalString = randomNumber.toString(16);

	return `id-${timeStamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
	return `
      <div class="wrapper ${isAi && "ai"}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? "bot" : "user"}"
            />
          </div>

          <div class="message" id="${uniqueId}">
            ${value}
          </div>
        </div>

      </div>
    `;
}

async function handleSubmit(e) {
	e.preventDefault();

	const data = new FormData(form);

	//User Chat Stripe
	chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

	form.reset();

	//Bot Chat Stripe
	const uniqueId = generateUniqueId();
	chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

	chatContainer.scrollTop = chatContainer.scrollHeight;

	const messageDiv = document.getElementById(uniqueId);

	loader(messageDiv);

	const response = await fetch(`${origin}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			prompt: data.get("prompt"),
		}),
	});

	clearInterval(loadInterval);
	messageDiv.innerHTML = "";

	if (response.ok) {
		const data = await response.json();
		const parsedData = data.bot.trim();

		typeText(messageDiv, parsedData);
	} else {
		const err = await response.json();

		messageDiv.innerHTML = "Something went wrong";

		alert(err);
	}
}

document.addEventListener("DOMContentLoaded", function () {
	this.getElementById("textarea").oninput = function () {
		this.style.height = "";
		this.style.height = Math.min(textarea.scrollHeight, 150) + "px";
	};

	form.addEventListener("submit", handleSubmit);
	form.addEventListener("keyup", (e) => {
		if (e.key === "Enter") {
			handleSubmit(e);
		}
	});
});
