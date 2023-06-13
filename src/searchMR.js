import buildPage from './buildResponse.js';

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

export default {
  buildResponseItem(result) {
    return `
    <tr class="firstrow">
      <td class="link">
      <span class="state state-${result.state}">${result.state}</span> <a href="${result.web_url}">${result.title}</a>
      </td>
      <td>
        From:
      </td>
      <td>
        <pre class="copy">${result.source_branch}</pre>
      </td>
    </tr>
    <tr>
      <td class="ref">
        ${result.references.full}
      </td>
      <td>To:</td>
      <td><pre class="copy">${result.target_branch}</pre></td>
    </tr>
    `;
  },
  buildResponse(results) {
    const rows = results.map(x => this.buildResponseItem(x))

    return `
    <table class="pure-table pure-table-horizontal search-results" style="width:100%">
      <thead>
          <tr>
              <th colspan="3">Search results</th>
          </tr>
      </thead>
      <tbody>
          ${rows.join('')}
      </tbody>
  </table>`;
  },
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let search = url.searchParams.getAll('search');

    if (!search) {
      return new Response('Bad request: Missing `search` query param', { status: 400 });
    }

    search = search
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .filter(onlyUnique);

    if (!search.length) {
      return new Response('Bad request: Missing `search` query param', { status: 400 });
    }


    console.log(`Search terms: ${search}`);

    let results = await Promise.all(
      search.map(q => fetch(`${env.GITLAB_BASE_URL}/api/v4/search?scope=merge_requests&search=${q}`, {
        headers: {
          'Authorization': `Bearer ${env.GITLAB_TOKEN}`
        }
      })).map(promise => promise.then(r => r.json()))
    );


    // The Response class has static methods to create common Response objects as a convenience
    return buildPage(this.buildResponse(results.flat(1)));
  },
};
