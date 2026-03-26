from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from dotenv import load_dotenv
from langchain_core.prompts import load_prompt
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

load_dotenv()

llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
    max_new_tokens=512,
    temperature=0.7,
    top_p=0.9,
    repetition_penalty=1.1
)

SYSTEM_PROMPT = load_prompt("temp.json")
parser = StrOutputParser()
model = ChatHuggingFace(llm=llm)

chain = SYSTEM_PROMPT | model | parser

def ask_lyra(question: str, history: list) -> str:
    """
    question: the latest user message
    history:  list of {"role": "user"|"assistant", "content": "..."} dicts
    """
    trimmed = history[-10:] if len(history) > 10 else history

    messages = [
    SystemMessage(content=SYSTEM_PROMPT.template)
]

    # Replay previous turns from history
    for turn in trimmed[:-1]:  # exclude the latest (we add it below)
        if turn["role"] == "user":
            messages.append(HumanMessage(content=turn["content"]))
        else:
            messages.append(AIMessage(content=turn["content"]))

    messages.append(HumanMessage(content=question))

    try:
        response = model.invoke(messages)
        return response.content
    except Exception as e:
        print("Model error:", e)
        return "⚠️ Lyra is having trouble. Please try again."
