import { BUSINESS, PRODUCTS, CATERING, FAQS } from '@/lib/constants'

// Spoken narration for every main page: the "Listen to this page" audio tour.
// Every fact here is composed from the same data the pages render
// (src/lib/constants.ts), so the narration can never say something the site
// does not. Audio is pre-generated once per section by scripts/narrate.mjs
// (hash-cached, so only edited sections ever re-bill); the player falls back
// to the browser voice for any section whose audio file is missing.
//
// anchor = the [data-narrate] attribute (or #id) of the section the player
// scrolls to and highlights while that part plays.

export type NarrationSection = {
  id: string
  title: string
  text: string
  anchor?: string
}

export type PageNarration = {
  title: string
  sections: NarrationSection[]
}

const list = (items: readonly string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`

const hoursSpoken = `We are open ${BUSINESS.hours
  .map((h) => `${h.day} from ${h.value.replace(/-/g, 'to')}`)
  .join(', ')}.`

const addressSpoken = `474 College Street in Wadsworth, Ohio`

export const narration: Record<string, PageNarration> = {
  '/': {
    title: `Welcome to ${BUSINESS.shortName}`,
    sections: [
      {
        id: 'welcome',
        title: 'Welcome',
        anchor: 'home-hero',
        text: `Welcome to ${BUSINESS.name}, Wadsworth's drive-thru beverage store. The coldest beer in town, and you never have to leave your car to get it. Beer, wine, seltzers, pop, snacks, candy, lottery, and tobacco, handed through your window. You will find us at ${addressSpoken}, and you can reach us at ${BUSINESS.phone}.`,
      },
      {
        id: 'lane',
        title: 'How the lane works',
        anchor: 'home-lane',
        text: `Here is how the lane works. Pull in: the lane runs straight through the building. Tell us what you need, and we grab it. Pay at the window, cash or card, with IDs checked. Then you are back on the road. Most trips take about a minute.`,
      },
      {
        id: 'products',
        title: "What's in the cave",
        anchor: 'home-products',
        text: `So what's in the cave? ${PRODUCTS.map((p) => `${p.title}: ${p.short}`).join(' ')}`,
      },
      {
        id: 'catering',
        title: 'Beverage catering',
        anchor: 'home-catering',
        text: `Throwing something bigger than a Tuesday? We cater drinks for ${list(CATERING.occasions.map((o) => o.toLowerCase()))}, and whatever else you are planning. Tell us the headcount and we will handle the coolers.`,
      },
      {
        id: 'visit',
        title: 'Come see us',
        anchor: 'home-visit',
        text: `We are locally owned and easy to find, and the reviews keep saying the same two things: fast, and friendly. ${hoursSpoken} Call us at ${BUSINESS.phone}, or just pull into the lane at ${addressSpoken}.`,
      },
    ],
  },
  '/products': {
    title: "What's in the cave",
    sections: [
      {
        id: 'overview',
        title: 'The short version',
        anchor: 'products-grid',
        text: `Every cooler in the building, from the domestics door to the canned-cocktail wall. Stock rotates with the season, so consider this a preview. ${PRODUCTS.map((p) => `${p.title}: ${p.short}`).join(' ')}`,
      },
      {
        id: 'gallery',
        title: 'Inside the coolers',
        anchor: 'products-gallery',
        text: `The photos on this page were shot on our phones between customers. This is what the cave looks like on a regular day. If you are after something specific, call ahead at ${BUSINESS.phone} and we will tell you if it is in the cooler before you drive over. A valid ID is required for alcohol and tobacco; you must be 21 or over.`,
      },
    ],
  },
  '/catering': {
    title: 'Beverage catering',
    sections: [
      {
        id: 'overview',
        title: 'Drinks for your event',
        anchor: 'catering-how',
        text: `Beverage catering from ${BUSINESS.shortName}. Weddings, office events, graduations, backyard blowouts. You plan the party; we make sure nobody stands in front of an empty cooler.`,
      },
      {
        id: 'how',
        title: 'How it works',
        anchor: 'catering-form',
        text: `Tell us the occasion, the date, and roughly how many people are coming. We will talk through what to stock, beer, wine, seltzers, pop, and mixers, and have it cold and ready. Use the form on this page, or call ${BUSINESS.phone} and we will talk it through.`,
      },
    ],
  },
  '/jobs': {
    title: 'Jobs at Bear Cave',
    sections: [
      {
        id: 'overview',
        title: 'Come work the window',
        anchor: 'jobs-pitch',
        text: `Come work the window. We are always looking for friendly, reliable people. If you like talking to half the town from a drive-thru window, you will fit right in. Cars roll through, you grab orders, check IDs, run the register, and keep the coolers stocked.`,
      },
      {
        id: 'apply',
        title: 'How to apply',
        anchor: 'jobs-form',
        text: `Apply with the form on this page, grab a paper application at the store at ${addressSpoken}, or message us on Facebook. If it looks like a fit, we will reach out to set up a time to talk.`,
      },
    ],
  },
  '/contact': {
    title: 'Find the cave',
    sections: [
      {
        id: 'visit',
        title: 'Where to find us',
        anchor: 'contact-hours',
        text: `You will find ${BUSINESS.shortName} at ${addressSpoken}. Look for the light blue building with the drive-thru lane running straight through it. ${hoursSpoken}`,
      },
      {
        id: 'reach',
        title: 'How to reach us',
        anchor: 'contact-form',
        text: `Call us at ${BUSINESS.phone}, message us on Facebook, or use the form on this page. If it is urgent, the phone is fastest; someone is at the window all day.`,
      },
      {
        id: 'faq',
        title: 'Common questions',
        text: `A few answers people often need. ${FAQS[1].q} ${FAQS[1].a} And one more: ${FAQS[8].q} ${FAQS[8].a}`,
      },
    ],
  },
}
