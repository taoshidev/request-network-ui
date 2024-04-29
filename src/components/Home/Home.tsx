"use client";

import Link from "next/link";
import NextImage from "next/image";
import { Text, Button, Image, Accordion } from "@mantine/core";

import { HeaderHome } from "../HeaderHome";

import bg from "@/assets/hero-bg.svg";
import logo from "@/assets/bittensor/logo.png";
import logoBlack from "@/assets/bittensor/logo-black.png";

import homeImage from "@/assets/home-image.png";

import subnet25 from "@/assets/bittensor/subnet-25.png";
import subnet18 from "@/assets/bittensor/subnet-18.png";
import subnet16 from "@/assets/bittensor/subnet-16.png";
import subnet15 from "@/assets/bittensor/subnet-15.png";
import subnet20 from "@/assets/bittensor/subnet-20.png";
import subnet27 from "@/assets/bittensor/subnet-27.png";
import subnet23 from "@/assets/bittensor/subnet-23.png";
import subnet08 from "@/assets/bittensor/subnet-08.png";
import subnet21 from "@/assets/bittensor/subnet-21.png";
import subnet22 from "@/assets/bittensor/subnet-22.png";
import subnet14 from "@/assets/bittensor/subnet-14.png";
import subnet13 from "@/assets/bittensor/subnet-13.png";

const groceries = [
  {
    value: "Consectetur aliqua qui consectetur voluptate mollit?",
    description:
      "Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads.",
  },
  {
    value: "Elit enim excepteur Lorem ad?",
    description:
      "Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking.",
  },
  {
    value: "Cillum dolore aute nulla ullamco magna proident?",
    description:
      "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries.",
  },
];

export function Home() {
  const items = groceries.map((item) => (
    <Accordion.Item className="bg-gray-200" key={item.value} value={item.value}>
      <Accordion.Control>{item.value}</Accordion.Control>
      <Accordion.Panel>{item.description}</Accordion.Panel>
    </Accordion.Item>
  ));
  return (
    <div>
      <div className="bg-primary-500 mb-8">
        <div className="container max-w-5xl mx-auto mb-10">
          <HeaderHome />
        </div>
        <div className="container mx-auto mb-10">
          <div className="flex justify-center items-center h-96">
            <div className="text-center text-primary-700">
              <Image
                className="mx-auto mb-4 mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={logo}
                w={48}
                h="auto"
              />
              <h1 className="text-8xl font-bold mb-8 ">request network</h1>
              <p className="max-w-3xl mx-auto mb-8">
                Do amet sit anim fugiat quis consectetur dolore enim anim
                laborum occaecat qui consectetur. Pariatur aliquip amet sunt
                aliquip reprehenderit.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  className="bg-primary-700"
                  component={Link}
                  href="/dashboard"
                >
                  <Text size="sm">Get Started</Text>
                </Button>
                <Button
                  variant="transparent"
                  className="text-white hover:text-primary-700"
                  component={Link}
                  href="/dashboard"
                >
                  <Text size="sm">Documentation</Text>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Image alt="Taoshi" component={NextImage} src={bg} />
      </div>
      <div className="container max-w-5xl mx-auto py-10 mb-32">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-primary-500">Alit</p>
          <h2 className="text-2xl font-bold mb-8">
            Fugiat ut est Lorem et reprehenderit duis est. Nisi nostrud enim
            eiusmod.
          </h2>
          <p>Exercitation culpa et aliquip duis.</p>
        </div>
        <div className="flex gap-20 items-center">
          <div className="flex-1 flex flex-col gap-10">
            <div>
              <p className="text-xl font-bold mb-4">
                Do deserunt nisi minim cillum ad.
              </p>
              <p>
                Incididunt tempor proident dolore. Culpa esse voluptate
                incididunt adipisicing aliqua laboris aliqua duis.
              </p>
            </div>
            <div>
              <p className="text-xl font-bold mb-4">
                Aute aliqua laboris ullamco veniam.
              </p>
              <p>
                Incididunt tempor proident dolore. Culpa esse voluptate
                incididunt adipisicing aliqua laboris aliqua duis.
              </p>
            </div>
            <div>
              <p className="text-xl font-bold mb-4">
                Fugiat culpa commodo culpa ex consequat do magna.
              </p>
              <p>
                Incididunt tempor proident dolore. Culpa esse voluptate
                incididunt adipisicing aliqua laboris aliqua duis.
              </p>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-10">
            <div className="w-[100px] h-[100px] bg-gray-200 flex justify-center items-center">
              <Image
                className="mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={subnet25}
                w={48}
                h="auto"
              />
            </div>
            <div className="w-[100px] h-[100px] bg-gray-200 flex justify-center items-center">
              <Image
                className="mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={subnet18}
                w={48}
                h="auto"
              />
            </div>
            <div className="w-[100px] h-[100px] bg-gray-200 flex justify-center items-center">
              <Image
                className="mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={subnet16}
                w={48}
                h="auto"
              />
            </div>
            <div className="w-[100px] h-[100px] bg-gray-200 flex justify-center items-center">
              <Image
                className="mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={subnet15}
                w={48}
                h="auto"
              />
            </div>
            <div className="w-[100px] h-[100px] bg-gray-200 flex justify-center items-center">
              <Image
                className="mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={subnet20}
                w={48}
                h="auto"
              />
            </div>
            <div className="w-[100px] h-[100px] bg-gray-200 flex justify-center items-center">
              <Image
                className="mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={subnet27}
                w={48}
                h="auto"
              />
            </div>
            <div className="w-[100px] h-[100px] bg-gray-200 flex justify-center items-center">
              <Image
                className="mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={subnet23}
                w={48}
                h="auto"
              />
            </div>
            <div className="w-[100px] h-[100px] bg-gray-200 flex justify-center items-center">
              <Image
                className="mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={subnet08}
                w={48}
                h="auto"
              />
            </div>
            <div className="w-[100px] h-[100px] bg-gray-200 flex justify-center items-center">
              <Image
                className="mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={subnet21}
                w={48}
                h="auto"
              />
            </div>
            <div className="w-[100px] h-[100px] bg-gray-200 flex justify-center items-center">
              <Image
                className="mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={subnet22}
                w={48}
                h="auto"
              />
            </div>
            <div className="w-[100px] h-[100px] bg-gray-200 flex justify-center items-center">
              <Image
                className="mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={subnet14}
                w={48}
                h="auto"
              />
            </div>
            <div className="w-[100px] h-[100px] bg-gray-200 flex justify-center items-center">
              <Image
                className="mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={subnet13}
                w={48}
                h="auto"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container max-w-5xl mx-auto mb-32">
        <div className="flex items-center gap-20">
          <div className="flex-1">
            <Image
              className="mix-blend-darken"
              alt="Taoshi"
              component={NextImage}
              src={homeImage}
              w={462}
              h="auto"
            />
          </div>
          <div className="flex-1">
            <p className="text-xl mb-4 font-bold">
              Do deserunt nisi minim cillum ad.
            </p>
            <p>
              Eu minim occaecat mollit. Quis velit commodo adipisicing eiusmod
              proident ut commodo do adipisicing mollit aute mollit fugiat est.
            </p>
          </div>
        </div>
      </div>
      <div className="container max-w-5xl mx-auto mb-32">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-2xl font-bold mb-8">Do You Have Questions?</h2>
          <p>We Have The Answers</p>
        </div>
        <Accordion radius={0} variant="separated" defaultValue="Apples">
          {items}
        </Accordion>
      </div>
      <div className="container mx-auto mb-10">
        <div className="flex justify-center items-center h-96">
          <div className="text-center text-black">
            <Image
              className="mx-auto mb-4 mix-blend-darken"
              alt="Taoshi"
              component={NextImage}
              src={logoBlack}
              w={32}
              h="auto"
            />
            <h1 className="text-5xl font-bold mb-8">experience seamless</h1>
            <p className="max-w-3xl mx-auto mb-8">
              Do amet sit anim fugiat quis consectetur dolore enim anim laborum
              occaecat qui consectetur. Pariatur aliquip amet sunt aliquip
              reprehenderit.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                className="text-sm bg-black font-normal"
                component={Link}
                href="/dashboard"
              >
                <Text size="sm">Get Started</Text>
              </Button>
              <Button
                className="text-black"
                variant="transparent"
                component={Link}
                href="/dashboard"
              >
                <Text size="sm">Documentation</Text>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary-500">
        <div className="container max-w-5xl mx-auto py-8">
          <p className="mb-12 font-adlam-display font-bold text-3xl text-primary-700">
            taoshi
          </p>
          <div className="flex text-white">
            <div className="flex-1">
              <p className="font-bold mb-4">Products</p>
              <div className="flex flex-col text-sm gap-2">
                <a href="https://www.taoshi.io/ptn" target="_blank">
                  Proprietary Trading Network
                </a>
                <a href="https://huggingface.co/Taoshi" target="_blank">
                  Models
                </a>
                <a href="https://dashboard.taoshi.io/" target="_blank">
                  Dashboard
                </a>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold mb-4">Company</p>
              <div className="flex flex-col text-sm gap-2">
                <a href="https://www.taoshi.io/partners" target="_blank">
                  Partners
                </a>
                <a href="https://www.taoshi.io/#team" target="_blank">
                  Our Team
                </a>
                <a href="mailto:support@taoshi.io">Contact Us</a>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold mb-4">Social Media</p>
              <div className="flex flex-col text-sm gap-2">
                <a href="https://twitter.com/taoshiio" target="_blank">
                  Twitter
                </a>
                <a
                  href="https://www.linkedin.com/company/taoshi/"
                  target="_blank"
                >
                  LinkedIn
                </a>
                <a href="https://discord.gg/pXa2Mnqu" target="_blank">
                  Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
