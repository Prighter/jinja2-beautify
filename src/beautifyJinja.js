import beautifier from "js-beautify";

export function beautifyJinja(htmlString = "") {
  const serializedHTML = jinjaToHTML(htmlString);
  const beautifiedHTML = beautifier.html_beautify(serializedHTML);
  return HTMLToJinja(beautifiedHTML);
}

function jinjaToHTML(jinjaString = "") {
  const r = /({%|{%-}) *(.*?) +(.*?) *(-%}|%})/gs;
  return jinjaString.replace(r, (match, _, cmd, __, ___,index) => {
    for (let i = index; i > 0; i--) {
      if(jinjaString[i] === ">")
        break;
      else if (jinjaString[i] === "<")
        return match;
    }
    console.log(cmd)
    if (cmd === "from" || cmd === "extends" || cmd === "set") {
      return `<jinjaTag ${match}></jinjaTag>`;
    } 
    if (cmd == "else" || cmd == "elif") {
      return `</jinjaTag><jinjaTag ${match}>`;
    }
    if (cmd.startsWith("end")) {
      return `</jinjaTag ${match}>`;
    }
    return `<jinjaTag ${match}>`;
  });
}

function HTMLToJinja(htmlString = "") {
  // eslint-disable-next-line prefer-regex-literals
  const r = new RegExp("(<jinjaTag|</jinjaTag) *(.*?) +(.*?) *(>|/>)", "gs");
  return htmlString
    .replace(r, (match) => {
      let tempMatch = match.replace(/<\/jinjaTag>/g, "");
      tempMatch = tempMatch.includes("</")
        ? tempMatch.replace(/<\/jinjaTag /g, "")
        : tempMatch.replace(/<jinjaTag /g, "");

      return tempMatch[tempMatch.length - 1] === ">"
        ? tempMatch.slice(0, tempMatch.length - 1)
        : tempMatch;
    })
}
