import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume-schema";

const makeStyles = (accent: string) =>
  StyleSheet.create({
    page: {
      paddingTop: 30,
      paddingBottom: 30,
      paddingHorizontal: 36,
      fontSize: 9,
      fontFamily: "Helvetica",
      color: "#1a1a1a",
      lineHeight: 1.4,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
      paddingBottom: 10,
      borderBottom: `1.5pt solid ${accent}`,
    },
    photo: { width: 54, height: 54, borderRadius: 27, marginRight: 12 },
    headerText: { flex: 1 },
    name: {
      fontSize: 19,
      lineHeight: 1.2,
      fontFamily: "Helvetica-Bold",
      color: accent,
    },
    jobTitle: { fontSize: 10, lineHeight: 1.2, color: "#555", marginTop: 4 },
    contactCol: { alignItems: "flex-end" },
    contactLine: { fontSize: 8.5, color: "#555", lineHeight: 1.5 },
    section: { marginBottom: 12 },
    sectionTitle: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 1.2,
      color: accent,
      backgroundColor: "#f1f5f9",
      paddingVertical: 3,
      paddingHorizontal: 6,
      marginBottom: 6,
    },
    row: { flexDirection: "row", justifyContent: "space-between" },
    bold: { fontFamily: "Helvetica-Bold" },
    muted: { color: "#666" },
    bullet: { flexDirection: "row", marginTop: 2 },
    bulletDot: { width: 9 },
    bulletText: { flex: 1 },
    item: { marginBottom: 7 },
  });

export default function CompactTemplate({
  data,
  accent = "#2d3748",
}: {
  data: ResumeData;
  accent?: string;
}) {
  const styles = makeStyles(accent);
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
    <Document title={`${personal.fullName} - Resume`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {personal.photo ? (
            <Image src={personal.photo} style={styles.photo} />
          ) : null}
          <View style={styles.headerText}>
            <Text style={styles.name}>{personal.fullName}</Text>
            {personal.jobTitle ? (
              <Text style={styles.jobTitle}>{personal.jobTitle}</Text>
            ) : null}
          </View>
          <View style={styles.contactCol}>
            {contacts.map((c, i) => (
              <Text key={i} style={styles.contactLine}>
                {c}
              </Text>
            ))}
          </View>
        </View>

        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{summary}</Text>
          </View>
        ) : null}

        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((job) => (
              <View key={job.id} style={styles.item} wrap={false}>
                <View style={styles.row}>
                  <Text>
                    <Text style={styles.bold}>{job.role}</Text>
                    {job.company ? `  —  ${job.company}` : ""}
                  </Text>
                  <Text style={styles.muted}>
                    {job.startDate} - {job.endDate || "Present"}
                  </Text>
                </View>
                {job.location ? (
                  <Text style={styles.muted}>{job.location}</Text>
                ) : null}
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
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((ed) => (
              <View key={ed.id} style={styles.item} wrap={false}>
                <View style={styles.row}>
                  <Text>
                    <Text style={styles.bold}>{ed.school}</Text>
                    {ed.degree ? `  —  ${ed.degree}` : ""}
                  </Text>
                  <Text style={styles.muted}>
                    {[ed.startDate, ed.endDate].filter(Boolean).join(" - ")}
                  </Text>
                </View>
                {ed.details ? <Text style={styles.muted}>{ed.details}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {cleanSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text>{cleanSkills.join("  |  ")}</Text>
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