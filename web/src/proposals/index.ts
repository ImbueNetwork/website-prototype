import "./detail/page/page";
import rootStyles from "../styles/common.css";


const $section = document.querySelector(".voting-section .container");
const $parent = $section?.parentElement;


document.head.appendChild(document.createRange().createContextualFragment(`
<h1>
test1
</h1>
`));
if ($section && $parent) {
    $parent.removeChild($section);

    while ($section.firstChild)
        $section.removeChild($section.firstChild);

    $section.appendChild(document.createRange().createContextualFragment(`
    <imbu-proposals-list-page></imbu-proposals-list-page>
    `))

    $parent.prepend($section);
}

document.head.appendChild(document.createRange().createContextualFragment(`
<link rel="stylesheet" href="https://unpkg.com/material-components-web@13.0.0/dist/material-components-web.min.css">
<link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet">
<style>
${rootStyles}
.voting-section.wf-section {
    display: block;
}
</style>
`));