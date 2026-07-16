from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

while True:
    user = input("You: ")

    if user.lower() in ["exit", "quit"]:
        break

    response = client.responses.create(
        model="gpt-5",
        input=user
    )

    print("AI:", response.output_text)