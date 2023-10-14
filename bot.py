import discord
from discord.ext import commands
import openai

# Set up the Discord bot
bot = commands.Bot(command_prefix='!', intents=discord.Intents.all())

# OpenAI API key
openai.api_key = "api-key"

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user.name}')

@bot.command()
async def ask(ctx, *, question):
    model_engine = "text-davinci-003"

    kalamkaar = openai.Completion.create(
        engine=model_engine,
        prompt=question,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )

    coders = kalamkaar.choices[0].text

    await ctx.send(coders)

bot.run('TOKEN')