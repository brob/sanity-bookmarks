const blocksToHtml = require('@sanity/block-content-to-html')
const h = blocksToHtml.h
const serializers = {
    types: {
      code: props => (
        h('pre', {className: props.node.language},
          h('code', props.node.code)
        )
      )
    }
  }

const sanityClient = require('@sanity/client')
const client = sanityClient({
    projectId: 'myf3wh95',
    dataset: 'production',
    useCdn: true // `false` if you want to ensure fresh data
})

const query = `*[_type == "newsletter"] {
    ...,
    bookmarks[]->
} | order(_createdAt desc)`


function prepNewsletter(data) {
    data.opening = blocksToHtml({
        blocks: data.opening,
        serializers: serializers
      })
    return data
}

module.exports = async function() {
    const data = await client.fetch(query)
    const preppedData = data.map(prepNewsletter)

    console.log(preppedData)
    return preppedData
}