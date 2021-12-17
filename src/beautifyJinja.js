import beautifier from "js-beautify";

export function beautifyJinja(htmlString = "") {
  const serializedHTML = jinjaToHTML(htmlString);
  const beautifiedHTML = beautifier.html_beautify(serializedHTML);
  return HTMLToJinja(beautifiedHTML);
}

function jinjaToHTML(jinjaString = "") {
  const r = /({%[-]?) *(.*?) +(.*?) *([-]?%})/gs;

  return jinjaString.replace(r, (match, _, cmd, __, ___, index) => {
    for (let i = index; i > 0; i -= 1) {
      if (jinjaString[i] === ">") break;
      else if (jinjaString[i] === "<") return match;
    }

    if (cmd === "from" || cmd === "extends" || cmd === "set" || cmd === "include") {
      return `<jinjaTag ${match}></jinjaTag>`;
    }
    if (cmd === "else" || cmd === "elif") {
      return `</jinjaTag><jinjaTag ${match}>`;
    }
    if (cmd.startsWith("end")) {
      return `</jinjaTag ${match}>`;
    }
    return `<jinjaTag ${match}>`;
  });
}

function HTMLToJinja(htmlString = "") {
  const jinjaString = htmlString.replace(/(\n *<\/jinjaTag>)|(<\/jinjaTag>)/g, "");

  const r = new RegExp("(<jinjaTag|</jinjaTag) *(.*?) +(.*?) *(}>|/>)", "gs");
  return jinjaString.replace(r, (match) => {
    const tempMatch = match.includes("</")
      ? match.replace(/<\/jinjaTag /g, "")
      : match.replace(/<jinjaTag /g, "");

    return tempMatch[tempMatch.length - 1] === ">"
      ? tempMatch.slice(0, tempMatch.length - 1)
      : tempMatch;
  });
}
