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

prompt = load_prompt("temp.json")
parser = StrOutputParser()
model = ChatHuggingFace(llm=llm)

chain = prompt | model | parser

def ask_lyra(question: str) -> str:
    messages =[]
    try:
        messages.append(HumanMessage(content=question))
        response = chain.invoke({"question": messages})
        messages.append(AIMessage(content=response))
        return response
    except Exception as e:
        print("Model error:", e)
        return "⚠️ Lyra is having trouble. Please try again."
