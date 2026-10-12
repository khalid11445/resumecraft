import { ReactNode } from "react";
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
      paddingTop: 44,
      paddingBottom: 44,
      paddingHorizontal: 46,
      fontSize: 9.5,
      fontFamily: "Helvetica",
      color: "#1f2937",
      lineHeight: 1.5,
    },
    header: { marginBottom: 22 },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerText: { flex: 1 },
    photo: { width: 74, height: 74, borderRadius: 37, marginLeft: 16 },
    name: {
      fontSize: 27,
      lineHeight: 1.15,
      fontFamily: "Helvetica-Bold",
      color: "#111827",
    },
    jobTitle: {
      fontSize: 10,
      lineHeight: 1.2,
      color: accent,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 2.5,
      marginTop: 8,
    },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 12 },
    contactItem: { fontSize: 8.5, color: "#6b7280", marginRight: 14 },
    section: { marginBottom: 18 },
    sectionTitle: {
      fontFamily: "Helvetica-Bold",
      fontSize: 10,
      letterSpacing: 2.5,
      textTransform: "uppercase",
      color: accent,
      marginBottom: 12,
    },
    item: { paddingLeft: 18, paddingBottom: 12 },
    line: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 1.5,
      backgroundColor: accent,
    },
    dot: {
      position: "absolute",
      left: -3.75,
      top: 2,
      width: 9,
      height: 9,
      borderRadius: 4.5,
      backgroundColor: accent,
    },
    dates: {
      fontSize: 8.5,
      color: accent,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    role: {
      fontFamily: "Helvetica-Bold",
      fontSize: 10.5,
      color: "#111827",
      marginTop: 2,
    },
    company: { color: "#6b7280", marginTop: 1 },
    bullet: { flexDirection: "row", marginTop: 3 },
    bulletDot: { width: 10, color: accent },
    bulletText: { flex: 1 },
  });

type Styles = ReturnType<typeof makeStyles>;

function Entry({
  styles,
  children,
}: {
  styles: Styles;
  children: ReactNode;
}) {
  return (
    <View style={styles.item} wrap={false}>
      <View style={styles.line} />
      <View style={styles.dot} />
      {children}
    </View>
  );
}

export default function TimelineTemplate({
  data,
  accent = "#4338ca",
  lang = "en",
}: {
  data: ResumeData;
  accent?: string;
  lang?: Lang;
}) {
  const styles = makeStyles(accent);
  const L = getLabels(lang);
  const { personal, summary, experience, education, skills, customSections } = data;

  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean) as string[];

  const cleanSkills = skills.map((s) => s.trim()).filter(Boolean);

  return (
    <Document title={`${personal.fullName} - CV`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerText}>
              <Text style={styles.name}>{personal.fullName}</Text>
              {personal.jobTitle ? (
                <Text style={styles.jobTitle}>{personal.jobTitle}</Text>
              ) : null}
            </View>
            {personal.photo ? (
              <Image src={personal.photo} style={styles.photo} />
            ) : null}
          </View>
          <View style={styles.contactRow}>
            {contacts.map((c, i) => (
              <Text key={i} style={styles.contactItem}>
                {c}
              </Text>
            ))}
          </View>
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
              <Entry key={job.id} styles={styles}>
                <Text style={styles.dates}>
                  {jobRange(job.startDate, job.endDate, lang)}
                </Text>
                <Text style={styles.role}>{job.role}</Text>
                <Text style={styles.company}>
                  {[job.company, job.location].filter(Boolean).join("  ·  ")}
                </Text>
                {job.bullets.filter(Boolean).map((b, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </Entry>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{L.education}</Text>
            {education.map((ed) => (
              <Entry key={ed.id} styles={styles}>
                <Text style={styles.dates}>
                  {eduRange(ed.startDate, ed.endDate, lang)}
                </Text>
                <Text style={styles.role}>{ed.school}</Text>
                {ed.degree ? <Text style={styles.company}>{ed.degree}</Text> : null}
                {ed.details ? <Text style={styles.company}>{ed.details}</Text> : null}
              </Entry>
            ))}
          </View>
        )}

        {cleanSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{L.skills}</Text>
            <Text>{cleanSkills.join("   /   ")}</Text>
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