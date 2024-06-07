"use client";

import React from "react";
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
import {useDisclosure} from "@mantine/hooks";

import {HeaderHome} from "./HeaderHome";

import zap from '@/assets/home/zap.png';
import bgWhite from '@/assets/home/bg-white.png';
import bgBlack from '@/assets/home/bg-black.png';
import subnets from '@/assets/home/subnets.png';

import bg from "@/assets/hero-bg.svg";
import logo from "@/assets/bittensor/logo.svg";
import logoBlack from "@/assets/bittensor/logo-black.png";

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
        The Request Network enables access to a wide range of data types from various Bittensor subnets. These include
        financial data, healthcare data, consumer insights, supply chain data, environmental data, and more. It also
        supports specialized data from subnets focused on large language models and decentralized storage.
      </Text>
    ),
  },
  {
    value:
      "What payment methods are supported by the Request Network for data exchange transactions?",
    description: (
      <Text className="text-sm">
        The Request Network uses Stripe to securely facilitate payments between consumers and validators.
      </Text>
    ),
  },
  {
    value:
      "How can validators customize their offerings and pricing models on the Request Network?",
    description: (
      <Text className="text-sm">
        Validators enjoy the flexibility to tailor their offerings and pricing models according to factors like data
        quality, uniqueness, and demand.
      </Text>
    ),
  },
  {
    value:
      "What incentives do validators have to participate in the Request Network?",
    description: (
      <Text className="text-sm">
        Validators are incentivized to participate in the Request Network as it grants them access to a wider consumer
        base and the opportunity to monetize their data assets and other services.
      </Text>
    ),
  },
  {
    value:
      "Can the Request Network be customized or modified by validators or subnet owners?",
    description: (
      <Text className="text-sm">
        Yes, the Request Network is designed as an open-source platform, allowing for flexibility and customization.
        Validators and subnet owners can tailor the platform to their specific needs by adjusting services, setting
        pricing models, and integrating additional features or functionalities.
      </Text>
    ),
  },
  {
    value:
      "What are some potential use cases for the data accessed through the Request Network?",
    description: (
      <Text className="text-sm">
        The Request Network enables data-driven innovation and value creation across diverse industries and domains.
        Potential use cases for data accessed through the Request Network include financial services, large language
        models, decentralized storage, healthcare and life sciences, marketing and advertising, supply chain and
        logistics, environmental monitoring, and more.
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
];

export default function Home({startLink}: { startLink: string }) {
  const [opened, {toggle}] = useDisclosure(false);

  return (
    <div>
      {process.env.NEXT_PUBLIC_ENV_NAME && (
        <Box className="z-10 pointer-events-none text-white absolute px-5 font-bold w-full top-0 opacity-60">
          {process.env.NEXT_PUBLIC_ENV_NAME}
        </Box>
      )}
      <div className="bg-primary-500 mb-8">
        <div className="container max-w-5xl mx-auto mb-10">
          <HeaderHome startLink={startLink}/>
        </div>
        <div className="container px-2 mx-auto py-10 mb-10">
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
              <h1
                data-cy="home-h1"
                className="text-6xl md:text-8xl font-bold mb-8"
              >
                request network
              </h1>
              <p className="max-w-3xl mx-auto mb-8">
                The Request Network, architected by Taoshi, is a digital marketplace for decentralized data and services
                from the Bittensor network. Get started and become empowered with tools to propel innovation, research,
                and development across various domains—all through the power of Bittensor.
              </p>
              <div className="flex gap-4 justify-center items-center">
                <Button
                  variant="white"
                  component={Link}
                  href={startLink}
                  data-cy="btn-dashboard"
                >
                  <Text size="sm">Get Started</Text>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Image alt="Taoshi" component={NextImage} src={bg}/>
      </div>

      <div className='container px-2 max-w-5xl mx-auto py-10'>

        <div className='text-center'>
          <h3 className='text-2xl font-adlam-display mb-4'>The Request Network: Your Marketplace for Decentralized
            Innovation</h3>
          <p className="text-sm mb-4">
            Step into a new era of decentralized innovation with the Request Network. Crafted by Taoshi for the
            Bittensor ecosystem, this versatile platform serves as a dynamic marketplace hub. Seamlessly connecting
            users to specialized services within each Bittensor subnet, it enables access to a wide array of offerings,
            including data, computational tasks, complex analyses, and more. The Request Network empowers users with
            tools for innovation, research, and development across diverse domains, all while ensuring trust and
            efficiency through Stripe payments.
          </p>
          <p className='text-sm'>
            As a portal to decentralized services, the Request Network stands at the forefront of a new paradigm,
            capable of integrating with every subnet on the Bittensor network to harness collective capabilities and
            drive the ecosystem forward.
          </p>
        </div>
      </div>

      <div className='container px-2 max-w-5xl mx-auto py-10 my-10'>
        <div className='text-center mb-12'>
          <h3 className='text-2xl font-adlam-display mb-4'>How it Works</h3>
          <p className="text-sm mb-8">
            The Request Network functions as a user-friendly marketplace, <br/>enabling consumers to easily purchase
            data, services, and more directly from validators.
          </p>
          <p className='text-sm font-bold'> To get started, follow the below steps:</p>
        </div>

        <div className='mb-10'>
          <div className="flex gap-10 justify-start">
            <div className='flex justify-center items-center'>
              <div className="bg-cover bg-no-repeat bg-top p-4 w-[600px] hidden md:block"
                   style={{backgroundImage: `url('${bgWhite.src}')`}}>
                <video autoPlay loop muted className='border inline'>
                  <source src="/mov/guide.mp4" type="video/mp4"/>
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>


            <div className='flex-1'>
              <ul className='mb-8 space-y-4 list-disc text-sm'>
                <li>
                  <span className='font-bold'>Registration: </span>
                  <span>
                    Visit the Request Network marketplace and register to create your user account.
                  </span>
                </li>
                <li>
                  <span className='font-bold'>Subnet Selection: </span>
                  <span>
                    Explore diverse subnets on the marketplace to find specialized services that meet your needs.
                  </span>
                </li>
                <li>
                  <span className='font-bold'>Validator Selection: </span>
                  <span>
                    Choose a validator within your selected subnet to fulfill your data and service requests.
                  </span>
                </li>
                <li>
                  <span className='font-bold text-sm'>Service Agreement: </span>
                  <span>
                    Review and agree to the terms of service with your chosen validator.
                  </span>
                </li>
                <li>
                  <span className='font-bold'>Payment: </span>
                  <span>
                    Securely complete the transaction using Stripe for a trustworthy exchange.
                  </span>
                </li>
                <li>
                  <span className='font-bold'>API Key Access: </span>
                  <span>
                    Upon payment confirmation, receive an API key for direct access to the validator&apos;s services or data.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='flex justify-center'>
          <Button component='a' href='https://request.taoshi.io/login' target='_blank'>Request Network
            Marketplace</Button>
        </div>
      </div>

      <div className="container px-2 max-w-5xl mx-auto py-10 my-10">
        <div className="flex gap-10 items-center">
          <div className="flex-1 flex flex-col">
            <div>
              <p className="text-2xl font-adlam-display mb-4">
                Fostering a Synergistic Ecosystem
              </p>
              <p className='text-sm'>
                Central to the Bittensor network is a vibrant community valuing each participant&apos;s contribution.
                The
                Request Network sparks a virtuous cycle within subnet ecosystems: miners are incentivized to offer data
                and computational services, while consumers access a rich suite of resources to elevate their endeavors.
                Validators, a backbone of the Bittensor ecosystem, currently receive 100% of the Request Network&apos;s
                transactional revenue, recognizing their crucial role in maintaining network integrity and facilitating
                its operations.
              </p>
            </div>
          </div>
          <div className="hidden md:block w-[300px] justify-center items-center">
            <Image
              alt="Taoshi"
              component={NextImage}
              src={subnets}
              w={300}
              h="auto"
              fit='contain'
            />
          </div>
        </div>
      </div>

      <div className="bg-[#282828]">
        <div
          className='bg-cover bg-no-repeat bg-top'
          style={{backgroundImage: `url('${bgBlack.src}')`}}
        >
          <div className="container px-2 max-w-5xl mx-auto sm:py-24 py-20">
            <div className="flex flex-col justify-center items-center">
              <div className="text-center text-white mb-10">
                <h3 className="font-adlam-display text-2xl mb-4">Ready to Integrate your Subnet with the Request
                  Network?</h3>
                <p className='text-sm'>
                  Any subnet within the Bittensor ecosystem can democratize their
                  highly valuable intelligence through the Request Network. <br/>Connect with our team via
                  Discord—we&apos;ll
                  work with you to swiftly complete the integration process.
                </p>
              </div>
              <Button component='a' href="https://discord.gg/pXa2Mnqu" target='_blank'>Join Our Discord</Button>

            </div>
          </div>
        </div>
      </div>

      <div className="container px-2 max-w-5xl mx-auto sm:py-24 py-20">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-2xl font-adlam-display">Do You Have Questions?</h2>
          <p>We Have the Answers</p>
        </div>
        <Accordion
          className="mb-4"
          radius={0}
          variant="separated"
          defaultValue="Apples"
        >
          {questions.slice(0, 5).map((item) => (
            <Accordion.Item
              className="bg-[#EDEBE9]"
              key={item.value}
              value={item.value}
            >
              <Accordion.Control>
                <Text className="text-sm">{item.value}</Text>
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
                className="bg-[#EDEBE9]"
                key={item.value}
                value={item.value}
              >
                <Accordion.Control>
                  <Text className="text-sm">{item.value}</Text>
                </Accordion.Control>
                <Accordion.Panel className="text-sm">
                  {item.description}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Collapse>
        <Center>
          <Button variant="subtle" onClick={toggle} data-cy="btn-questions">
            {opened ? "Less" : "More"} Questions
          </Button>
        </Center>
      </div>


      <div>
        <div
          className='bg-cover bg-no-repeat bg-top'
          style={{backgroundImage: `url('${bgWhite.src}')`}}
        >
          <div className="container px-2 max-w-5xl mx-auto sm:py-24 py-20">
            <div className="flex justify-center items-center">
              <div className="text-center text-black">
                <Image
                  className="mx-auto mb-4"
                  alt="Taoshi"
                  component={NextImage}
                  src={logoBlack}
                  w={32}
                  h="auto"
                />
                <h3 className="font-adlam-display text-2xl mb-4">How is Taoshi Using the Request Network?</h3>
                <p className='text-sm mb-10'>
                  Taoshi is using the Request Network to help fulfill our vision
                  to empower traders and institutions by democratizing access to
                  trading signals from our Proprietary Trading Network (PTN). It
                  will act as a digital marketplace where you can select and
                  purchase the most relevant, world-class trading signals for your
                  strategies, tailored to your preferred asset classes and
                  currency pairs.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    component={Link}
                    href={startLink}
                    data-cy="btn-dashboard-2"
                  >
                    <Text size="sm">Get Started</Text>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-500">
        <div className="container px-2 max-w-5xl mx-auto py-8 text-white">
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
