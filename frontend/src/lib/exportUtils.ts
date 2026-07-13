import { Document, Paragraph, TextRun, Packer, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { Resume } from '@/types';

export const exportToTxt = (resume: Resume) => {
  const { personalInfo, professionalSummary, experience, education, skills, projects, custom } = resume;

  let text = '';

  if (personalInfo.fullName) text += `${personalInfo.fullName.toUpperCase()}\n`;
  
  const contacts = [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean);
  if (contacts.length > 0) text += `${contacts.join(' | ')}\n`;
  
  const links = [personalInfo.linkedin, personalInfo.github].filter(Boolean);
  if (links.length > 0) text += `${links.join(' | ')}\n`;

  text += '\n';

  if (professionalSummary) {
    text += `PROFESSIONAL SUMMARY\n`;
    text += `${professionalSummary}\n\n`;
  }

  if (experience && experience.length > 0) {
    text += `EXPERIENCE\n`;
    experience.forEach(exp => {
      text += `${exp.role} at ${exp.company}\n`;
      text += `${exp.location ? exp.location + ' | ' : ''}${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
      if (exp.bullets) {
        exp.bullets.forEach(bullet => {
          text += `* ${bullet}\n`;
        });
      }
      text += '\n';
    });
  }

  if (education && education.length > 0) {
    text += `EDUCATION\n`;
    education.forEach(edu => {
      text += `${edu.degree} in ${edu.field}\n`;
      text += `${edu.institution} | ${edu.startYear} - ${edu.endYear}\n`;
      if (edu.grade) text += `Grade: ${edu.grade}\n`;
      text += '\n';
    });
  }

  if (skills && skills.length > 0) {
    text += `SKILLS\n`;
    skills.forEach(skill => {
      text += `${skill.category}: ${skill.items.join(', ')}\n`;
    });
    text += '\n';
  }

  if (projects && projects.length > 0) {
    text += `PROJECTS\n`;
    projects.forEach(proj => {
      text += `${proj.name}\n`;
      if (proj.technologies && proj.technologies.length > 0) {
        text += `Tech: ${proj.technologies.join(', ')}\n`;
      }
      if (proj.description) {
        text += `${proj.description}\n`;
      }
      text += '\n';
    });
  }

  if (custom && custom.title && custom.content) {
    text += `${custom.title.toUpperCase()}\n`;
    text += `${custom.content}\n\n`;
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `resume-${resume.id}.txt`);
};

export const exportToDocx = async (resume: Resume) => {
  const { personalInfo, professionalSummary, experience, education, skills, projects, custom } = resume;

  const children: any[] = [];

  // Header
  if (personalInfo.fullName) {
    children.push(
      new Paragraph({
        text: personalInfo.fullName.toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        alignment: 'center',
      })
    );
  }

  const contacts = [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean);
  if (contacts.length > 0) {
    children.push(
      new Paragraph({
        text: contacts.join(' | '),
        alignment: 'center',
      })
    );
  }

  const links = [personalInfo.linkedin, personalInfo.github].filter(Boolean);
  if (links.length > 0) {
    children.push(
      new Paragraph({
        text: links.join(' | '),
        alignment: 'center',
      })
    );
  }

  children.push(new Paragraph({ text: '' })); // Spacer

  // Summary
  if (professionalSummary) {
    children.push(
      new Paragraph({ text: 'PROFESSIONAL SUMMARY', heading: HeadingLevel.HEADING_2 })
    );
    children.push(new Paragraph({ text: professionalSummary }));
    children.push(new Paragraph({ text: '' }));
  }

  // Experience
  if (experience && experience.length > 0) {
    children.push(new Paragraph({ text: 'EXPERIENCE', heading: HeadingLevel.HEADING_2 }));
    experience.forEach(exp => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.role, bold: true }),
            new TextRun({ text: ` at ${exp.company}` }),
          ],
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${exp.location ? exp.location + ' | ' : ''}${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, italics: true }),
          ],
        })
      );
      if (exp.bullets) {
        exp.bullets.forEach(bullet => {
          children.push(
            new Paragraph({
              text: bullet,
              bullet: { level: 0 },
            })
          );
        });
      }
      children.push(new Paragraph({ text: '' }));
    });
  }

  // Education
  if (education && education.length > 0) {
    children.push(new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_2 }));
    education.forEach(edu => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true }),
            new TextRun({ text: ` in ${edu.field}` }),
          ],
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.institution} | ${edu.startYear} - ${edu.endYear}`, italics: true }),
          ],
        })
      );
      if (edu.grade) {
        children.push(new Paragraph({ text: `Grade: ${edu.grade}` }));
      }
      children.push(new Paragraph({ text: '' }));
    });
  }

  // Skills
  if (skills && skills.length > 0) {
    children.push(new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2 }));
    skills.forEach(skill => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${skill.category}: `, bold: true }),
            new TextRun({ text: skill.items.join(', ') }),
          ],
        })
      );
    });
    children.push(new Paragraph({ text: '' }));
  }

  // Projects
  if (projects && projects.length > 0) {
    children.push(new Paragraph({ text: 'PROJECTS', heading: HeadingLevel.HEADING_2 }));
    projects.forEach(proj => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true }),
          ],
        })
      );
      if (proj.technologies && proj.technologies.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `Technologies: ${proj.technologies.join(', ')}`, italics: true }),
            ],
          })
        );
      }
      if (proj.description) {
        children.push(new Paragraph({ text: proj.description }));
      }
      children.push(new Paragraph({ text: '' }));
    });
  }

  // Custom
  if (custom && custom.title && custom.content) {
    children.push(new Paragraph({ text: custom.title.toUpperCase(), heading: HeadingLevel.HEADING_2 }));
    children.push(new Paragraph({ text: custom.content }));
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `resume-${resume.id}.docx`);
};
