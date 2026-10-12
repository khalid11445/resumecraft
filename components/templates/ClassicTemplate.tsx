import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume-schema";
import { Lang, getLabels, jobRange, eduRange } from "@/lib/labels";

const makeStyles = (accent: string) =>
  StyleSheet.create({
    page: {
      padding: 44,
      fontSize: 10.5,
      fontFamily: "Times-Roman",
      color: "#1f1f1f",
      lineHeight: 1.4,
    },
    header: {
      alignItems: "center",
      marginBottom: 18,
      paddingBottom: 12,
      borderBottom: `1.5pt solid ${accent}`,
    },
    photo: { width: 70, height: 70, borderRadius: 35, marginBottom: 8 },
    name: {
      fontFamily: "Times-Bold",
      fontSize: 24,
      lineHeight: 1.2,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: accent,
    },
    jobTitle: {
      fontFamily: "Times-Italic",
      fontSize: 12.5,
      lineHeight: 1.2,
      color: "#444",
      marginTop: 6,
    },
    contact: { fontSize: 9.5, color: "#444", marginTop: 8, textAlign: "center" },
    section: { marginBottom: 16 },
    sectionTitle: {
      fontFamily: "Times-Bold",
      fontSize: 11,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color: accent,
      borderBottom: "0.5pt solid #999",
      paddingBottom: 3,
      marginBottom: 8,
    },
    item: { marginBottom: 10 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    bold: { fontFamily: "Times-Bold" },
    italic: { fontFamily: "Times-Italic", color: "#444" },
    muted: { color: "#555" },
    bullet: { flexDirection: "row", marginTop: 2 },
    bulletDot: { width: 10 },
    bulletText: { flex: 1 },
  });

export default function ClassicTemplate({
  data,
  accent = "#222222",
  lang = "en",
}: {
  data: ResumeData;
  accent?: string;
  lang?: Lang;
}) {
  const styles = makeStyles(accent);
  const L = getLabels(lang);
  const { personal, summary, experience, education, skills, customSections } = data;

  const contact = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ]
    .filter(Boolean)
    .join("  |  ");

  const cleanSkills = skills.map((s) => s.trim()).filter(Boolean);

  return (
    <Document title={`${personal.fullName} - CV`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {personal.photo ? (
            <Image src={personal.photo} style={styles.photo} />
          ) : null}
          <Text style={styles.name}>{personal.fullName}</Text>
          {personal.jobTitle ? (
            <Text style={styles.jobTitle}>{personal.jobTitle}</Text>
          ) : null}
          {contact ? <Text style={styles.contact}>{contact}</Text> : null}
        </View>

        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{L.summary}</Text>
            <Text>{summary}</Text>
          </View>
        ) : null}

        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{L.experience}</Text>
            {experience.map((job) => (
              <View key={job.id} style={styles.item} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{job.company}</Text>
                  <Text style={styles.muted}>
                    {jobRange(job.startDate, job.endDate, lang)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.italic}>{job.role}</Text>
                  {job.location ? (
                    <Text style={styles.muted}>{job.location}</Text>
                  ) : null}
                </View>
                {job.bullets.filter(Boolean).map((b, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{L.education}</Text>
            {education.map((ed) => (
              <View key={ed.id} style={styles.item} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{ed.school}</Text>
                  <Text style={styles.muted}>
                    {eduRange(ed.startDate, ed.endDate, lang)}
                  </Text>
                </View>
                {ed.degree ? <Text style={styles.italic}>{ed.degree}</Text> : null}
                {ed.details ? <Text style={styles.muted}>{ed.details}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {cleanSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{L.skills}</Text>
            <Text>{cleanSkills.join("  ·  ")}</Text>
          </View>
        )}

        {customSections.map((sec) => {
          const items = sec.items.filter(Boolean);
          if (items.length === 0) return null;
          return (
            <View key={sec.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {items.map((item, i) => (
                <View key={i} style={styles.bullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
}