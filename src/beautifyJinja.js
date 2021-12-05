import beautifier from "js-beautify";

export function beautifyJinja(htmlString = "") {
  const serializedHTML = jinjaToHTML(htmlString);
  const beautifiedHTML = beautifier.html_beautify(serializedHTML);

  return HTMLToJinja(beautifiedHTML);
}

function jinjaToHTML(jinjaString = "") {
  const r = /({%) *(.*?) +(.*?) *(%})/g;
  return jinjaString.replace(r, (match, _, cmd) => {
    if (cmd === "from" || cmd === "extends" || cmd === "set") {
      return `<jinjaTag ${match}></jinjaTag>`;
    }
    if (cmd.startsWith("end")) {
      return `</jinjaTag ${match}>`;
    }
    return `<jinjaTag ${match}>`;
  });
}

function HTMLToJinja(htmlString = "") {
  // eslint-disable-next-line prefer-regex-literals
  const r = new RegExp("(<jinjaTag|</jinjaTag) *(.*?) +(.*?) *(>|/>)", "g");
  return htmlString
    .replace(r, (match) => {
      const tempMatch = match.includes("</")
        ? match.replace("</jinjaTag ", "")
        : match.replace("<jinjaTag ", "");

      return tempMatch[tempMatch.length - 1] === ">"
        ? tempMatch.slice(0, tempMatch.length - 1)
        : tempMatch;
    })
    .replace(/<\/jinjaTag>/g, "");
}
