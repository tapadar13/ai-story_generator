"use client";

import { useEffect, useState, useRef } from "react";

import Image from "next/image";
import Head from "next/head";
import Header from "./Header";
import { toast } from "sonner";

import CopyIcon from "../../public/assets/copy.svg";
import TickIcon from "../../public/assets/tick.svg";

const StoryForm = () => {
  const [name, setName] = useState("");
  const [setting, setSetting] = useState("");
  const [creature, setCreature] = useState("");
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState([]);
  const [copied, setCopied] = useState("");
  const generatedStoriesRef = useRef(null);

  // Load saved stories from localStorage when the component mounts
  useEffect(() => {
    const savedStories = localStorage.getItem("generatedStories");
    if (savedStories) {
      try {
        const parsedStories = JSON.parse(savedStories);
        setStory(parsedStories);
      } catch (error) {
        console.error("Error parsing saved stories:", error);
      }
    }
  }, []);

  const generateStory = async () => {
    if (!name || !setting || !creature) {
      toast.error("Please fill in all fields before generating the story.");
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: "POST",
          body: JSON.stringify({
            story: `As a master storyteller, create an enchanting and personalized fantasy tale for ${name}. Set the story in a ${setting} setting, where ${creature} plays a pivotal role in the magical adventure. Let the narrative unfold with vivid imagery and captivating twists, tailored specifically for ${name}'s imagination and enjoyment.`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate story");
        toast.error("Failed to generate story");
      }

      const aiAnswer = await response.json();
      // const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br />");
      const formattedAnswer = aiAnswer.reply;

      // Limit the number of stored stories to 2
      const newStories = [formattedAnswer, ...story.slice(0, 1)];
      setStory(newStories);

      // Save generated stories to localStorage
      localStorage.setItem("generatedStories", JSON.stringify(newStories));

      toast.success("Story generated!");

      // Scroll to the section of generated stories after generating a new story
      if (generatedStoriesRef.current !== null) {
        generatedStoriesRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
      setName("");
      setSetting("");
      setCreature("");
    }
  };

  const copyToClipboard = (text) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(false), 3000);

      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Fantasy Story Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4">
        <p className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
          5,298 stories generated so far
        </p>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Craft Personalized Fantasy Tales with{" "}
          <span className="orange_gradient">OpenAI GPT-3.5</span>
        </h1>

        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-medium">Drop in your name</p>
          </div>
          <textarea
            value={name}
            onChange={(e) => setName(e.target.value)}
            rows={1}
            className="w-full rounded-md border-gray-200 shadow-sm px-3 focus:border-black focus:ring-black my-5 text-gray-500 border-1 border-opacity-10 focus:border-opacity-50 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            placeholder={"eg. John Doe"}
          />

          <div className="flex items-center space-x-3">
            <p className="text-left font-medium">Name your preferred setting</p>
          </div>
          <textarea
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            rows={1}
            className="w-full rounded-md border-gray-200 shadow-sm px-3 focus:border-black focus:ring-black my-5 text-gray-500 border-1 border-opacity-10 focus:border-opacity-50 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            placeholder={"eg. mythological, medieval, futuristic etc."}
          />

          <div className="flex items-center space-x-3">
            <p className="text-left font-medium">
              Enter your favorite magical creature or element{" "}
            </p>
          </div>
          <div className="block mb-5">
            <textarea
              value={creature}
              onChange={(e) => setCreature(e.target.value)}
              rows={1}
              className="w-full rounded-md border-gray-200 shadow-sm px-3 focus:border-black focus:ring-black my-5 text-gray-500 border-1 border-opacity-10 focus:border-opacity-50 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              placeholder={"eg. dragons, spells, enchanted objects"}
            />
          </div>

          {!generating && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={() => generateStory()}
            >
              Generate your story &rarr;
            </button>
          )}
          {generating && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              Generating...
            </button>
          )}
        </div>
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <section className="space-y-10 my-10">
          {story.length > 0 && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={generatedStoriesRef}
                >
                  Your generated tales
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {story &&
                  story.map((item) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-10 hover:bg-gray-100 transition cursor-copy border relative"
                        key={item}
                      >
                        <div
                          className="copy_btn"
                          onClick={() => copyToClipboard(item)}
                        >
                          <Image
                            src={copied === item ? TickIcon : CopyIcon}
                            alt="copy_btn"
                            className="absolute top-2 right-3 w-[4%] h-[4%]"
                          />
                        </div>
                        <p>{item}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default StoryForm;
