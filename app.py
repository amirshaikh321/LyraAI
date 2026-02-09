from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate, load_prompt
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task='text-generation'
)
prompt = load_prompt('temp.json')
parser = StrOutputParser()
model = ChatHuggingFace(llm= llm)

chain = prompt | model | parser

question = input('Enter Your Question:\n')
result = chain.invoke({'question':question})
print(result)
