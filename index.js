const OpenAI = require("openai");
require("dotenv").config();
var similarity = require("compute-cosine-similarity");

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const goals = [
  `-Less than three sentences\n-Short and actionable\n-Mentions Halloween\n-Uses the word "spooky"`,
  `-Returns a boolean\nTakes an integer as input\n-Returns true if the integer is even, false if it is odd`,
  `-Deeply and vividly describes a picture of a pumpkin\n-Uses the word "orange"\n-Uses the word "carved"\n-Employs rule of thirds`,
];

// raw attempt
const attemptOne = [
  `I stood outside the haunted house, my heart pounding in my chest. The wind howled through the trees, and the moon cast an eerie light on the scene. I took a deep breath and stepped inside, ready to face whatever spooky surprises awaited me. I could feel the hairs on the back of my neck standing up as I walked through the darkened hallways, the sound of creaking floorboards echoing in my ears. I knew I was in for a night of thrills and chills, but I was determined to make it through to the end.`,
  `function isEven(num: string): number {
        num = parseInt(num);
        return num;
      }`,
  `Its a picture of pumpkin`,
];

// better attempt "post edit"
const attemptTwo = [
  `I stood outside the haunted house, my heart pounding in my chest. The wind howled through the trees, and the moon cast an eerie light on the scene. I took a deep breath and stepped inside, ready to face whatever spooky surprises awaited me.`,
  `function isEven(num: number): boolean {
        return num % 2 === 0;
      }`,
  `The pumpkin sat on the front porch, its bright orange skin glowing in the light of the setting sun. It had been carved with intricate designs, each one more detailed than the last. The flickering candle inside cast eerie shadows on the walls, making the pumpkin seem almost alive. It was the perfect decoration for Halloween, a symbol of the season's spooky delights.`,
];

// worst attempt
const attemptThree = [
  `How do I get my husband to stop going ‘Goblin Mode’ during sex?

  TLDR; My husband says ‘Goblin Mode activated’ when we start to have sex, growls and acts like a caveman, and then says ‘Goblin Mode off’ when we stop, and then pretends not to remember afterward.
  
  I really love my husband and he’s always been great in bed. But recently he’s been acting really weird. So, a couple of days ago, my son went on a rampage through our house and said he was in ‘Goblin Mode’. We didn’t really know what to do with him, so we sent him to live with my parents so he can go to a special needs school. My husband a really great relationship with our son and loved him more than anything. Naturally, he was upset when he had to leave. He’s an incredibly tough man, but this was the first time I’ve ever seen him cry. I think since then, he’s been a little emotionally unwell. I’ve heard him muttering, ‘Goblin’ repeatedly when he didn’t notice me, staring blankly into his food, and just going alone by himself to do who knows what. I feel awful for him, but we both agreed that this was for the best. Last night, the day after our son went away, we decided to have sex to relieve our stress. However, my husband said ‘Goblin Mode activated’, starting growling, and went wild having sex with me. Admittedly, it was some of the best and most experimental sex I’ve ever had, but I’m worried that something might be going on with my husband. Any advice?
  
  Edit: The problem isn’t the ‘Goblin Mode’, it’s that he could be ill`,
  `function helloWorld() {
        console.log("Hello, world!");
        }`,
  `LOOK AT THIS PHOTOGRAPH`,
];

async function main() {
  for (let i = 0; i < goals.length; i++) {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: goals[i],
      encoding_format: "float",
    });

    // embed attemptOne and attemptTwo
    const attemptOneEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: attemptOne[i],
      encoding_format: "float",
    });

    const attemptTwoEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: attemptTwo[i],
      encoding_format: "float",
    });

    const attemptThreeEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: attemptThree[i],
      encoding_format: "float",
    });

    // calculate cosine similarity
    const similarityOne = similarity(
      embedding.data[0].embedding,
      attemptOneEmbedding.data[0].embedding
    );

    const similarityTwo = similarity(
      embedding.data[0].embedding,
      attemptTwoEmbedding.data[0].embedding
    );

    const similarityThree = similarity(
      embedding.data[0].embedding,
      attemptThreeEmbedding.data[0].embedding
    );

    console.log(`Goal ${i + 1}:`);
    console.log(`Attempt One: ${similarityOne}`);
    console.log(`Attempt Two: ${similarityTwo}`);
    console.log(`Attempt Three: ${similarityThree}`);
    console.log("\n");
  }
}

main();
