import React from "react";
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
export default function LearnMoreAutoMessage() {
  return (
    <>
      <Header>How to automate sending message?</Header>
      <Paragraph>
        To start automating message sending first go to{" "}
        <strong>"Compose New Message"</strong> from the main menu.
      </Paragraph>
      <SubHeader>Composing a message</SubHeader>
      <Paragraph>
        <BulletPoint>
          Each message can consist of three sections, the{" "}
          <strong>greetings</strong> section the
          <strong> farewell</strong> section and the <strong>body</strong>. All
          three sections can be randomised to create random messages.
        </BulletPoint>
      </Paragraph>
      <Images
        src="/automessageimg1.png"
        alt="compose message section"
        width={"70%"}
      />
      <Paragraph>
        <strong className="title">Greetings and Farewell</strong>
        <br />
        You can put your own greeting and farewell or let the app choose a
        random greeting or farewell in (1). In the greetings section you can
        also choose to include the contacts name by selecting (2). The name that
        will be used is the name thats used to save the contact on your{" "}
        <TextLink href="..#ServiceDevice">Service device</TextLink>. In the
        farewell section you can also choose to sign the message (3). You can
        also choose to leave these sections blank.
      </Paragraph>
      <Images
        src="/automessageimg2.png"
        alt="compose message section"
        width={"70%"}
      />
      <Images
        src="/automessageimg3.png"
        alt="compose message section"
        width={"70%"}
      />
      <Paragraph>
        <strong className="title">The Body</strong>
        <br />
        The body is the main section of composing a message, you can have one or
        multiple bodies, and the app will randomly select which to send to the
        receiver.
        <br />
        Once you have the body written you have to <strong>save</strong> it, to
        add more bodies click on (1). If you want to change the text in any body
        choose the body from (2). You also have the option to add random
        variables by having the tags ([PRODUCT],[BRAND]...) in your body text.
        To set the values for the tags click on (3).
      </Paragraph>
      <Images
        src="/automessageimg4.png"
        alt="compose message section"
        width={"70%"}
      />
      <SubHeader>Selecting Contacts</SubHeader>
      <Paragraph>
        The contacts available to message are contacts on the whatsapp of your
        service device, any blocked or non whatsapp contact cannot be messaged
        for obvious reasons. Once you've selected your contacts you can start
        sending your message
      </Paragraph>
      <Images
        src="/automessageimg5.png"
        alt="compose message section"
        width={"70%"}
      />
      <SubHeader>Sending the message</SubHeader>
      <Paragraph>
        Once you're done composing the message and selecting the contacts you
        can start sending the messages. You can pause or stop at any time and
        continue later as you wish by going to <strong>"All Messages"</strong>{" "}
        in the main menu.
      </Paragraph>
      <Images
        src="/automessageimg6.png"
        alt="compose message section"
        width={"70%"}
      />
      <SubSection header="Tips">
        <CompactParagraph>
          <BulletPoint>
            To play with the weight of the randomness where you want more
            receivers to receive a particular body text, if you have 3 bodies
            just add the body you want more people to receive twice or more
            times, that will increase the chances for that particular body to be
            selected for more receivers by the randomiser.
          </BulletPoint>
          <br />
          <BulletPoint>
            An easy way to get multiple bodies is by using chatGPT to generate
            multiple messages containing the tags ([PRODUCT],[BRAND]...).
          </BulletPoint>
        </CompactParagraph>
      </SubSection>
    </>
  );
}
