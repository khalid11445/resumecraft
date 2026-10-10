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
      paddingTop: 36,
      paddingBottom: 36,
      paddingHorizontal: 36,
      fontSize: 9.5,
      fontFamily: "Helvetica",
      color: "#1f2937",
      lineHeight: 1.45,
    },
    band: {
      marginTop: -36,
      marginHorizontal: -36,
      backgroundColor: accent,
      paddingVertical: 26,
      paddingHorizontal: 36,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    bandText: { flex: 1 },
    name: {
      fontSize: 26,
      lineHeight: 1.15,
      fontFamily: "Helvetica-Bold",
      color: "#ffffff",
    },
    jobTitle: {
      fontSize: 10.5,
      lineHeight: 1.2,
      color: "#f3f4f6",
      marginTop: 7,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    photo: {
      width: 78,
      height: 78,
      borderRadius: 39,
      marginLeft: 16,
      borderWidth: 2.5,
      borderColor: "#ffffff",
      borderStyle: "solid",
    },
    contactBar: {
      marginHorizontal: -36,
      backgroundColor: "#f3f4f6",
      paddingVertical: 8,
      paddingHorizontal: 36,
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 20,
    },
    contactItem: { fontSize: 8.5, color: "#4b5563", marginRight: 16 },
    section: { marginBottom: 18 },
    titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    titleBar: {
      width: 4,
      height: 13,
      backgroundColor: accent,
      marginRight: 8,
    },
    sectionTitle: {
      fontFamily: "Helvetica-Bold",
      fontSize: 10.5,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color: "#111827",
    },
    item: { marginBottom: 11 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    role: { fontFamily: "Helvetica-Bold", fontSize: 10.5, color: "#111827" },
    company: { color: accent, fontFamily: "Helvetica-Bold", marginTop: 1 },
    date: { fontSize: 8.5, color: "#6b7280" },
    muted: { color: "#6b7280" },
    bullet: { flexDirection: "row", marginTop: 3 },
    bulletDot: { width: 10, color: accent },
    bulletText: { flex: 1 },
    chips: { flexDirection: "row", flexWrap: "wrap" },
    chip: {
      backgroundColor: "#eef0f3",
      borderRadius: 3,
      paddingVertical: 3,
      paddingHorizontal: 8,
      marginRight: 5,
      marginBottom: 5,
    },
    chipText: { fontSize: 8.5, color: accent, fontFamily: "Helvetica-Bold" },
  });

type Styles = ReturnType<typeof makeStyles>;

function Title({ text, styles }: { text: string; styles: Styles }) {
  return (
    <View style={styles.titleRow}>
      <View style={styles.titleBar} />
      <Text style={styles.sectionTitle}>{text}</Text>
    </View>
  );
}

export default function BoldTemplate({
  data,
  accent = "#1b2a41",
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
        <View style={styles.band}>
          <View style={styles.bandText}>
            <Text style={styles.name}>{personal.fullName}</Text>
            {personal.jobTitle ? (
              <Text style={styles.jobTitle}>{personal.jobTitle}</Text>
            ) : null}
          </View>
          {personal.photo ? (
            <Image src={personal.photo} style={styles.photo} />
          ) : null}
        </View>

        <View style={styles.contactBar}>
          {contacts.map((c, i) => (
            <Text key={i} style={styles.contactItem}>
              {c}
            </Text>
          ))}
        </View>

        {summary ? (
          <View style={styles.section}>
            <Title text="About me" styles={styles} />
            <Text>{summary}</Text>
          </View>
        ) : null}

        {experience.length > 0 && (
          <View style={styles.section}>
            <Title text="Experience" styles={styles} />
            {experience.map((job) => (
              <View key={job.id} style={styles.item} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.role}>{job.role}</Text>
                  <Text style={styles.date}>
                    {job.startDate} - {job.endDate || "Present"}
                  </Text>
                </View>
                <Text style={styles.company}>
                  {[job.company, job.location].filter(Boolean).join("  ·  ")}
                </Text>
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
            <Title text="Education" styles={styles} />
            {education.map((ed) => (
              <View key={ed.id} style={styles.item} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.role}>{ed.school}</Text>
                  <Text style={styles.date}>
                    {[ed.startDate, ed.endDate].filter(Boolean).join(" - ")}
                  </Text>
                </View>
                {ed.degree ? <Text style={styles.company}>{ed.degree}</Text> : null}
                {ed.details ? <Text style={styles.muted}>{ed.details}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {cleanSkills.length > 0 && (
          <View style={styles.section}>
            <Title text="Skills" styles={styles} />
            <View style={styles.chips}>
              {cleanSkills.map((s, i) => (
                <View key={i} style={styles.chip}>
                  <Text style={styles.chipText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {customSections.map((sec) => {
          const items = sec.items.filter(Boolean);
          if (items.length === 0) return null;
          return (
            <View key={sec.id} style={styles.section}>
              <Title text={sec.title} styles={styles} />
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