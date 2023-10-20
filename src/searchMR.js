import buildResponse from './buildResponse.js';

function onlyUnique(value, index, array) {
	return array.indexOf(value) === index;
}

function mrId(mr) {
	return mr.project_id + '_' + mr.iid;
}

export default {
  buildUser(user) {
    return `<span class="user"><img src="${user.avatar_url}"> <a href="${user.web_url}">${user.name}</a></span>`;
  },
	buildSearchResponseItem(result, approvals) {
    const approved = approvals && approvals.approved_by.length > 0;

		return `
    <tr class="firstrow">
      <td class="link">
        <div class="title"><span class="state state-${result.state}">${result.state}</span> <a href="${result.web_url}">${
			result.title
		}</a></div>
        <div class="ref">${result.references.full}</div>
        <div class="ref">
          By: ${this.buildUser(result.author)}
          ${result.merged_by ? `| Merged by: ${this.buildUser(result.merged_by)}` : ''}
        </div>
      </td>
      <td>
        <div>From:</div>
        <div>To:</div>
        ${approved ? `<div>Approved (${approvals.approved_by.length}):</div>` : ''}
      </td>
      <td>
        <div><pre class="copy">${result.source_branch}</pre></div>
        <div><pre class="copy">${result.target_branch}</pre></div>
        ${approved ? `<div>${approvals.approved_by.map(a => this.buildUser(a.user)).join(', ')}</div>` : ''}
      </td>
    </tr>
    `;
	},
	buildSearchResponse(notionId, results, approvals) {
		const rows = results.map((mr) => this.buildSearchResponseItem(mr, approvals[mrId(mr)]));

		return `
    ${notionId ? `<div class="notion-id">Notion ID: <a href="https://notion.so/${notionId}">${notionId}</a></div>` : ''}

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
		let notionId = url.searchParams.get('notionId');

		if (!search) {
			return new Response('Bad request: Missing `search` query param', { status: 400 });
		}

		if (notionId != null) {
			search.push(notionId);
		}

		search = search
			.map((q) => q.trim())
			.filter((q) => q.length > 0)
			.filter(onlyUnique);

		if (!search.length) {
			return new Response('Bad request: Missing `search` query param', { status: 400 });
		}

		let results = await Promise.all(
			search
				.map((q) =>
					fetch(`${env.GITLAB_BASE_URL}/api/v4/search?scope=merge_requests&search=${q}`, {
						headers: {
							Authorization: `Bearer ${env.GITLAB_TOKEN}`,
						},
					})
				)
				.map((promise) => promise.then((r) => r.json()))
		);

		results = results.flat(1);
		results = results.filter((mr, index, self) => index === self.findIndex((otherMr) => mrId(otherMr) === mrId(mr)));
		results = results.filter((mr) => search.find(s => mr.title != null && mr.title.includes(s)) != null);

		let approvals = await Promise.all(
			results
				.map((q) =>
					fetch(`${env.GITLAB_BASE_URL}/api/v4/projects/${q.project_id}/merge_requests/${q.iid}/approvals`, {
						headers: {
							Authorization: `Bearer ${env.GITLAB_TOKEN}`,
						},
					}).then((r) => r.json()).then(json => ({ ...json, project_id: q.project_id, iid: q.iid }))
				)
		);

		approvals = approvals.reduce((map, mr) => {
			map[mrId(mr)] = mr;
			return map;
		}, {});

		return buildResponse(this.buildSearchResponse(notionId, results, approvals), notionId || search.join(", "));
	},
};
