
export default function buildResponse(body) {
  return new Response(
    `<html>
    <head>
      <title>Поисковик MRов в GitLab</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css" integrity="sha384-X38yfunGUhNzHpBaEBsWLO+A0HDYOQi8ufWDkZ0k9e0eXz/tH3II7uKZ9msv++Ls" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/grids-responsive-min.css" />
      <style>
        body {
          padding: 1em;
        }
        pre {
          display:inline;
        }
        .search-results tr td {
          padding: .2em 1em;
          padding-bottom: 0.5em;
        }
        .search-results tr.firstrow td {
          border-bottom: none;
          padding-bottom: .2em;
          padding-top: 0.5em;
        }
        .copy {
          color:#585;
          cursor:pointer;
        }
        .copy:active {
          color:#338;
        }
        .link a {
          text-decoration: none;
        }
        .ref {
          line-height: 1.5rem;
          margin-top: 0.25rem;
          color: #777;
        }
        .state {
          text-transform: uppercase;
          box-sizing: border-box;
          font-size: 0.7rem;
          padding: 0.5em 1em;
          border-radius: 1rem;
          background-color: #eee;
        }
        .state-opened {
          background-color: #c3e6cd;
          color: #24663b;
        }
        .state-merged {
          background-color: #cbe2f9;
          color: #0b5cad;
        }
        .state-closed {
          background-color: #fdd4cd;
          color: #ae1800;
        }
      </style>
      <script>
        function copyme(e) {
          const text = e.target.innerText;
          navigator.clipboard.writeText(text);
        }
        document.addEventListener('DOMContentLoaded', function() {
          const copyEls = document.querySelectorAll('pre.copy');
          copyEls.forEach(el => el.addEventListener('click', copyme));
        });
      </script>
    </head>
    <body>
      <div class="pure-g">
        <div class="pure-u-1 pure-u-md-1-6"></div>
        <div class="pure-u-1 pure-u-md-2-3">
          ${body}
        </div>
        <div class="pure-u-1 pure-u-md-1-6"></div>
      </div>
    </body>
    </html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
