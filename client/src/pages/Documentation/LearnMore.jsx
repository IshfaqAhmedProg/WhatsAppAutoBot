import React from "react";
import { Box, Image, Stack } from "@chakra-ui/react";
import PageTitle from "../../components/PageTitle";
import { Link } from "react-router-dom";
import {
  Header,
  Paragraph,
  CompactParagraph,
  SubHeader,
  SubSection,
  Images,
  TextLink,
  BulletPoint,
} from "../../components/DocumentationComponents";

export default function LearnMore() {
  return (
    <>
      <Stack alignItems={"center"}>
        <Link to="https://github.com/IshfaqAhmedProg" target="_blank">
          <Image
            src="/WhatsappBotLogo.png"
            alt="Logo"
            boxSize="200px"
            objectFit="cover"
          />
        </Link>
      </Stack>
      <section>
        <Header>What is WhatsappAutoBot?</Header>
        <Paragraph>
          <strong>
            WhatsappAutoBot {"("}WAB{")"}
          </strong>{" "}
          is a tool that allows a user to validate and automate anything you can
          do in the web version of whatsapp{" "}
          <TextLink href="https://web.whatsapp.com" />. WAB runs by you
          installing the main server and database on your device, and then
          accessing the client online, this makes it safe to use as no data ever
          leaves your system. Although you will need internet for the client to
          work as that is on a hosted service.
        </Paragraph>
      </section>
      <section>
        <SubSection header="Features">
          <CompactParagraph>
            <strong className="title">Validate Numbers:</strong>
            <br /> You can use WAB to validate numbers in an excel or csv sheet.
            Manual input is also supported so if you have few numbers to
            validate you can do it manually too.
            <br />
            <strong className="title">Automate Sending Messages:</strong>
            <br /> You can select multiple contacts and send randomized
            customizable messages automatically.
          </CompactParagraph>
          <Paragraph textAlign="center">
            <strong className="title">More coming soon!</strong>
            <br />
          </Paragraph>
        </SubSection>
      </section>
      <section>
        <Header>Getting Started</Header>
        <section>
          <SubSection header="Requirements">
            <CompactParagraph>
              <strong className="title">System:</strong>
              <br />
              Windows 8,10,11
              <br />
              <strong className="title">Memory:</strong>
              <br />
              4 Gb+
              <br />
              <strong className="title">Devices:</strong> You will need a PC to
              run the server and client. You will also need a device where
              whatsapp mobile version is installed. This will be referred to as
              your <strong>"Service device"</strong>.
            </CompactParagraph>
          </SubSection>
        </section>
        <section>
          <SubHeader>Downloading the Server</SubHeader>
          <Paragraph>
            To start using WAB first visit&nbsp;
            <TextLink href="https://whatsappautobot.vercel.app" />.
          </Paragraph>
          <section>
            <Paragraph>
              <BulletPoint>
                Download the server files by clicking on{" "}
                <strong>"Get the latest server files"</strong>. A google drive
                download (~120mb) will begin, you might be warned that the file
                is too big to be scanned, the scan reports for the file can be
                found{" "}
                <TextLink href="https://www.virustotal.com/gui/file/cce92fb4be26e8a8b3925ccbb3365abc22b571030f3e16c42318489cb44b2bab/detection">
                  here
                </TextLink>
              </BulletPoint>
            </Paragraph>
          </section>
          <section>
            <Images
              src="/learnmoreimg1.png"
              alt="download server"
              width={"70%"}
            />
            <Paragraph>
              <BulletPoint>
                Install the downloaded file "WhatsappAutoBotX_X_XSetup.exe", and
                allow the <strong>WhatsappAutoBot.exe</strong> on your firewall.
              </BulletPoint>
            </Paragraph>
          </section>
          <section>
            <Paragraph>
              <BulletPoint>
                Run the <strong>WhatsappAutoBot.exe</strong> file and now your
                server is ready to connect to the
                web-app(whatsappautobot.vercel.app).
              </BulletPoint>
            </Paragraph>
          </section>
        </section>
        <section>
          <SubHeader>Creating the Client</SubHeader>
          <section>
            <Paragraph>
              Once you have the server up and running go to any browser and
              browse to <TextLink href="https://whatsappautobot.vercel.app" />.
            </Paragraph>
          </section>
          <section>
            <Paragraph>
              <BulletPoint>
                Before creating a client make sure the version of the web-client
                and your server matches.
              </BulletPoint>
            </Paragraph>

            <Images
              src="/connectedtoserver.png"
              alt="make sure to check if connected to server or not"
            />
          </section>
          <section>
            <Paragraph>
              <BulletPoint>
                Create a client by writing the name of the client and clicking
                on submit (1) or if you've already created a client you can just
                login by clicking on login (2). If you've already logged in and
                don't see the option to login (2) then just refresh the page.
              </BulletPoint>
            </Paragraph>
          </section>
          <section>
            <Paragraph>
              <BulletPoint>
                You will be asked to scan a <strong>QR code</strong> the first
                time you create a client, scan the QR code with your{" "}
                <strong>Service Device</strong>. Once you're registered, you can
                then login to that client by just clicking on login (2). This
                client is an instance to the web.whatsapp.com, so if you havent{" "}
                <strong>logged in for 11 days</strong> then you will be
                automatically logged out by whatsapp and you will have to rescan
                the QR code.
              </BulletPoint>
            </Paragraph>
            <Images
              src="/learnmoreimg2.png"
              alt="create a client"
              width={"70%"}
            />
          </section>
          <section>
            <Paragraph>
              <BulletPoint>
                Once you've logged in you'll be on this screen.
              </BulletPoint>
            </Paragraph>
            <Images
              src="/learnmoreimg3.png"
              alt="logged in screen"
              width={"70%"}
            />
          </section>
          <section>
            <Paragraph>
              To know more about each section click on the links below, you can
              also find them inside each menu option on the top-right.
            </Paragraph>
          </section>
        </section>
      </section>
    </>
  );
}
