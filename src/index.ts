import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { zValidator } from '@hono/zod-validator'
import { StringUtils } from './utils/string-utils.js';
import { gitCloneSchema } from './lib/schemas/git-clone-schema.js';
import { GitRepositoryAnalyzer } from './lib/helpers/git-analyzer.js';

const app = new Hono();

app.get('/:userName/:repositoryName',
  zValidator("param",gitCloneSchema),
  async (c) => {
  const {repositoryName , userName} = c.req.valid('param')
  const repositoryUrl = StringUtils.createRepoUrl(userName, repositoryName);

  try {
    const output = await GitRepositoryAnalyzer.analyzeGitRepository(userName, repositoryUrl, repositoryName);
    return c.text(output);
  } catch (error) {
    if(error instanceof Error){
      return c.json(`Error cloning or analyzing repository: ${error.message}`, 500);
    }
  }
})

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);