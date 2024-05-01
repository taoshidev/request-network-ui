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
    value: "How is Taoshi Using the Request Network?",
    description:
      "Taoshi is using the Request Network to help fulfill our vision to empower traders and institutions by democratizing access to trading signals from our Proprietary Trading Network (PTN). It will act as a digital marketplace where you can select and purchase the most relevant, world-class trading signals for your strategies, tailored to your preferred asset classes and currency pairs.",
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
        <div className="container mx-auto py-10 mb-10">
          <div className="flex justify-center items-center h-96">
            <div className="text-center text-primary-900">
              <Image
                className="mx-auto mb-4 mix-blend-darken"
                alt="Taoshi"
                component={NextImage}
                src={logo}
                w={48}
                h="auto"
              />
              <h1 className="text-8xl font-bold mb-8">request network</h1>
              <p className="max-w-3xl mx-auto mb-8">
                Enter a new service and data exchange era with the Request
                Network, a versatile platform built for the Bittensor ecosystem
                and architected by Taoshi.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  className="bg-primary-800"
                  component={Link}
                  href="/dashboard"
                >
                  <Text size="sm">Get Started</Text>
                </Button>
                <Button
                  variant="transparent"
                  className="text-white hover:text-primary-900"
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
        <div className="max-w-xl mx-auto text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">
            Introducing the Request Network on Bittensor
          </h2>
          <p>One for all, all for one.</p>
        </div>
        <div className="flex gap-20 items-center">
          <div className="flex-1 flex flex-col gap-10">
            <div>
              <p className="text-xl font-bold mb-2">
                A Hub for Decentralized Services and Data
              </p>
              <p>
                The Request Network heralds a new paradigm in decentralized
                services, offering a dynamic marketplace that can be integrated
                with every subnet built on Bittensor.
              </p>
            </div>
            <div>
              <p className="text-xl font-bold mb-2">
                Harnessing the Collective Capabilities of Subnets
              </p>
              <p>
                The Request Network is your portal to the vast array of services
                offered by Bittensor&apos;s subnets.
              </p>
            </div>
            <div>
              <p className="text-xl font-bold mb-2">
                Fostering a Synergistic Ecosystem
              </p>
              <p>
                At the heart of the Bittensor network is a thriving community
                where every participant&apos;s contribution is valued. The
                Request Network catalyzes a virtuous cycle within each subnet.
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
            <p className="text-xl mb-2 font-bold">
              Ready to Integrate your Subnet with the Request Network?
            </p>
            <p>
              Any subnet within the Bittensor ecosystem can democratize their
              highly valuable intelligence through the Request Network. If you’d
              like to integrate your subnet with the Request Network, please
              reach out to our team via email at{" "}
              <a href="mailto:support@taoshi.io">support@taoshi.io</a> - we’ll
              work with you to complete the integration as soon as possible!
            </p>
          </div>
        </div>
      </div>
      <div className="container max-w-5xl mx-auto mb-32">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">Do You Have Questions?</h2>
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
          <p className="mb-12 font-adlam-display font-bold text-3xl text-primary-900">
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
