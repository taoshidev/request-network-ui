"use client";

import Link from "next/link";
import NextImage from "next/image";
import {
  Text,
  Button,
  Image,
  Accordion,
  Collapse,
  Center,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { HeaderHome } from "../HeaderHome";

import bg from "@/assets/hero-bg.svg";
import logo from "@/assets/bittensor/logo.svg";
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

const questions = [
  {
    value:
      "What is the Request Network, and how does it benefit the Bittensor ecosystem?",
    description: (
      <Text className="text-sm">
        The Request Network is an open-source platform that enables third
        parties to buy and receive data provided by validators, allowing them to
        use subnet data. It benefits the Bittensor ecosystem by increasing
        network usage, providing validators with financial incentives, and
        improving the overall health of the ecosystem.
      </Text>
    ),
  },
  {
    value:
      "How does the Request Network facilitate data exchange between validators and consumers?",
    description: (
      <Text className="text-sm">
        The Request Network serves as the underlying protocol that facilitates
        secure and efficient data transfer between validators and consumers. It
        provides a marketplace where validators can list their data offerings,
        and consumers can discover and acquire relevant data. The Request
        Network handles the handshake mechanism, payment coordination, and data
        delivery.
      </Text>
    ),
  },
  {
    value:
      "What role do validators play in the Request Network, and how can they participate?",
    description: (
      <Text className="text-sm">
        Validators are entities that verify and offer data for sale on the
        Request Network. They ensure the accuracy and availability of the data
        they provide. Validators can participate by listing their data
        offerings, setting their own pricing models, and maintaining a strong
        reputation within the network.
      </Text>
    ),
  },
  {
    value:
      "Who are the consumers in the Request Network, and how can they access subnet data?",
    description: (
      <Text className="text-sm">
        Consumers are third-party entities that utilize the Request Network to
        access and acquire valuable subnet data from validators. They can browse
        the marketplace, discover relevant data sources, agree to pricing terms,
        and provide financial incentives to validators in exchange for data
        access.
      </Text>
    ),
  },
  {
    value: "What types of data can be accessed through the Request Network?",
    description: (
      <Text className="text-sm">
        The Request Network enables access to a wide range of data types from
        various Bittensor subnets, such as financial data, healthcare data,
        consumer insights, supply chain data, environmental data, and more. It
        also supports specialized data from subnets focused on large language
        models and decentralized storage.
      </Text>
    ),
  },
  {
    value:
      "How does the Request Network ensure secure and efficient data transfer between validators and consumers?",
    description: (
      <Text className="text-sm">
        The Request Network provides the necessary infrastructure and protocols
        to facilitate secure and reliable data transfer. It ensures the
        integrity and confidentiality of the data exchanged, maintaining trust
        between validators and consumers.
      </Text>
    ),
  },
  {
    value:
      "What payment methods are supported by the Request Network for data exchange transactions?",
    description: (
      <Text className="text-sm">
        The Request Network primarily uses stablecoins as the means of payment
        for data exchange transactions. Stablecoins provide stability and
        mitigate the risks associated with cryptocurrency volatility.
      </Text>
    ),
  },
  {
    value:
      "How can validators customize their offerings and pricing models on the Request Network?",
    description: (
      <Text className="text-sm">
        Validators have the flexibility to customize their offerings and pricing
        models based on factors such as data quality, uniqueness, and demand.
        They can specialize in certain types of data or cater to specific
        industries or use cases.
      </Text>
    ),
  },
  {
    value:
      "What incentives do validators have to participate in the Request Network?",
    description: (
      <Text className="text-sm">
        Validators are incentivized to participate in the Request Network as
        they can earn stablecoins as payment for their services. They gain
        access to a broader consumer base and have the opportunity to monetize
        their data assets.
      </Text>
    ),
  },
  {
    value:
      "Can the Request Network be customized or modified by validators or subnet owners?",
    description: (
      <Text className="text-sm">
        Yes, the Request Network is designed to be an open-source platform,
        allowing for flexibility and customization. Validators and subnet owners
        have the freedom to tailor the platform to their specific needs, such as
        spinning up or down services, setting pricing models, and integrating
        additional features or functionalities.
      </Text>
    ),
  },
  {
    value:
      "What are some potential use cases for the data accessed through the Request Network?",
    description: (
      <Text className="text-sm">
        Potential use cases for data accessed through the Request Network
        include financial services, large language models, decentralized
        storage, healthcare and life sciences, marketing and advertising, supply
        chain and logistics, environmental monitoring, and more. The Request
        Network enables data-driven innovation and value creation across diverse
        industries and domains.
      </Text>
    ),
  },
  {
    value:
      "How does the Request Network contribute to the broader adoption of decentralized technologies?",
    description: (
      <Text className="text-sm">
        The Request Network contributes to the broader adoption of decentralized
        technologies by providing a standardized and incentivized platform for
        data exchange. It showcases the potential of decentralized solutions,
        attracts a diverse range of participants, and positions Bittensor as a
        leader in the decentralized data solutions space.
      </Text>
    ),
  },
  {
    value:
      "What future enhancements and developments are planned for the Request Network?",
    description: (
      <Text className="text-sm">
        Future enhancements and developments planned for the Request Network
        include validator enhancements, such as improved UI/UX and performance
        tracking, subnet inheritance, consumer enhancements, and the
        incorporation of a reputation and feedback system.
      </Text>
    ),
  },
  {
    value:
      "How can the Bittensor community contribute to the success and growth of the Request Network?",
    description: (
      <Text className="text-sm">
        The Bittensor community can contribute to the success and growth of the
        Request Network by actively participating in the platform, providing
        valuable data, and continuously improving the network. They can also
        spread awareness about the Request Network, provide feedback, and
        collaborate on future developments.
      </Text>
    ),
  },
];

export function Home({ startLink }: { startLink: string }) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <div>
      {process.env.NEXT_PUBLIC_ENV_NAME && (
        <Box className="z-10 pointer-events-none text-white absolute px-5 font-bold w-full top-0 opacity-60">
          {process.env.NEXT_PUBLIC_ENV_NAME}
        </Box>
      )}
      <div className="bg-primary-500 mb-8">
        <div className="container max-w-5xl mx-auto mb-10">
          <HeaderHome startLink={startLink} />
        </div>
        <div className="container mx-auto py-10 mb-10">
          <div className="flex justify-center items-center h-96">
            <div className="text-center text-white">
              <Image
                className="mx-auto mb-4 fill-white"
                alt="Taoshi"
                component={NextImage}
                src={logo}
                w={48}
                h="auto"
              />
              <h1 className="text-6xl md:text-8xl font-bold mb-8">
                request network
              </h1>
              <p className="max-w-3xl mx-auto mb-8">
                Enter a new service and data exchange era with the Request
                Network, a versatile platform built for the Bittensor ecosystem
                and architected by Taoshi.
              </p>
              <div className="flex gap-4 justify-center items-center">
                <Button variant="white" component={Link} href="/dashboard">
                  <Text size="sm">Get Started</Text>
                </Button>
                <Button component={Link} href="#">
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
          <p>All for one, one for all</p>
        </div>
        <div className="flex gap-20 items-center">
          <div className="flex-1 flex flex-col gap-10">
            <div>
              <p className="text-lg font-bold mb-2">
                A Hub for Decentralized Services and Data
              </p>
              <p>
                The Request Network heralds a new paradigm in decentralized
                services, offering a dynamic marketplace that can be integrated
                with every subnet built on Bittensor.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold mb-2">
                Harnessing the Collective Capabilities of Subnets
              </p>
              <p>
                The Request Network is your portal to the vast array of services
                offered by Bittensor&apos;s subnets.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold mb-2">
                Fostering a Synergistic Ecosystem
              </p>
              <p>
                At the heart of the Bittensor network is a thriving community
                where every participant&apos;s contribution is valued. The
                Request Network catalyzes a virtuous cycle within each subnet.
              </p>
            </div>
          </div>
          <div className="flex-1 md:grid grid-cols-3 gap-10 hidden">
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
      <div className="container max-w-5xl mx-auto mb-32 md:bg-transparent bg-primary-500 text-white md:text-black p-4">
        <div className="flex items-center gap-20">
          <div className="flex-1 hidden md:block">
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
            <p className="text-lg mb-2 font-bold">
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
        <Accordion
          className="mb-4"
          radius={0}
          variant="separated"
          defaultValue="Apples"
        >
          {questions.slice(0, 5).map((item) => (
            <Accordion.Item
              className="bg-gray-200"
              key={item.value}
              value={item.value}
            >
              <Accordion.Control>
                <Text className="text-sm font-bold">{item.value}</Text>
              </Accordion.Control>
              <Accordion.Panel className="text-sm">
                {item.description}
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
        <Collapse className="mb-4" in={opened}>
          <Accordion radius={0} variant="separated" defaultValue="Apples">
            {questions.slice(5, questions.length).map((item) => (
              <Accordion.Item
                className="bg-gray-200"
                key={item.value}
                value={item.value}
              >
                <Accordion.Control>
                  <Text className="text-sm font-bold">{item.value}</Text>
                </Accordion.Control>
                <Accordion.Panel className="text-sm">
                  {item.description}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Collapse>
        <Center>
          <Button variant="subtle" onClick={toggle}>
            {opened ? "Less" : "More"} Questions
          </Button>
        </Center>
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
              <Button component={Link} href={startLink}>
                <Text size="sm">Get Started</Text>
              </Button>
              <Button variant="transparent" component={Link} href="#">
                <Text size="sm">Documentation</Text>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary-500">
        <div className="container max-w-5xl mx-auto py-8 text-white">
          <p className="mb-12 font-adlam-display font-bold text-3xl">taoshi</p>
          <div className="flex">
            <div className="flex-1">
              <p className="font-bold mb-4">Products</p>
              <div className="flex flex-col text-sm gap-2">
                <a href="https://www.taoshi.io/ptn" target="_blank">
                  PTN
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
