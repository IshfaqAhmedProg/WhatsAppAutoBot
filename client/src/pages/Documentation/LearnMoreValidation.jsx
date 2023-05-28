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

export default function LearnMoreValidation() {
  return (
    <>
      <Header>How to validate numbers?</Header>
      <Paragraph>
        There are two ways you can validate numbers.
        <br />
        The first method is to manually input the numbers and names of contacts
        you want to validate. The second method is by uploading either a
        excel(.xlsx,.xls) or CSV(.csv) file containing the numbers and some form
        of identifier for the numbers like name, email etc.
      </Paragraph>
      <SubHeader>Creating a validation task</SubHeader>
      <Paragraph>
        <BulletPoint>
          First go to the <strong>Create Validation Task</strong> page and use
          either (1) or (2) to input your numbers. If you use (2) make sure to
          have <strong>atleast two columns</strong>, one containing the{" "}
          <strong>numbers</strong> and the other containing some form of{" "}
          <strong>identifier</strong> like email, name etc. Also change any
          header that matches the keywords below
        </BulletPoint>
      </Paragraph>
      <Images
        src="/validationimg1.png"
        alt="validation section"
        width={"70%"}
      />
      <Paragraph>
        <BulletPoint>
          If you've used the second method you will be asked to select the
          header of the column containing the numbers. You can also choose to
          <strong> include input file data </strong> which will, add new columns
          containing the validation result, to your input file. Use this if you
          want to keep modify your dataset with the validation result instead of
          having a seperate file with the validation results.
        </BulletPoint>
      </Paragraph>
      <Images
        src="/validationimg2.png"
        alt="validation section"
        width={"70%"}
      />
      <Paragraph>
        <BulletPoint>
          Once the .vcf file containing all the numbers are created, download it
          and copy it to your
          <TextLink href="..#ServiceDevice">"Service device"</TextLink>. Then on
          the service device run the .vcf file (either by clicking on it and
          probably the device will ask to import the contacts, or by importing
          through contacts in your Service device)
        </BulletPoint>
      </Paragraph>
      <Paragraph>
        <BulletPoint>
          Next open whatsapp on your service device to load the newly added
          contacts.
        </BulletPoint>
      </Paragraph>
      <Paragraph>
        <BulletPoint>
          Then you can go to the<strong> Validation Tasks </strong>page in the
          main menu and download the validation results.
        </BulletPoint>
      </Paragraph>
      <Images
        src="/validationimg3.png"
        alt="validation section"
        width={"70%"}
      />
      <SubSection header="Look out for">
        <CompactParagraph>
          <strong className="title">
            If you select the option to include input file you can have issues
            with storage in your hard disk, when you have too many tasks or too
            large tasks. So it is recommended to delete any old or unnecessary
            validation tasks.
          </strong>
        </CompactParagraph>
      </SubSection>
    </>
  );
}
