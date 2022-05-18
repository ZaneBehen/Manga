import Head from 'next/head';
import Link from 'next/link';
import Sidebar from '../Sidebar';
import { useRouter } from 'next/router'

const defaultEndpoint = `https://api.jikan.moe/v4/manga/`;

export async function getServerSideProps( {query} ) {
  const {mal_id} = query
  const reccomend = mal_id + '/recommendations'
  const res = await fetch(`${defaultEndpoint}` + mal_id);
  const data = await res.json(); 
  const datas = await (await fetch('https://api.jikan.moe/v4/manga/' + reccomend)).json();
  return {
    props: {
      data,
      datas
    }
  }
}

export default function Character({ data, datas }) {
  const dataz = Object.values(datas)
  const datax = dataz[0]
  const recdata = datax.slice(0,4)

  return (
    <div className="gradient bg-gradient-to-r from-cyan-500 to-emerald-500 sm:overflow-hidden overflow-visible">
      <Head>
        <title></title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="gradient bg-gradient-to-r from-cyan-500 to-emerald-500 h-screen w-screen flex flex-row flex-shrink-0 sm:flex-shrink">
      <Sidebar/>

      <main className='m-0 p-0 w-full'>
      <div className='gradient bg-gradient-to-r from-cyan-500 to-emerald-500 w-screen sm:w-full'>
      {Object.values(data).map(result => {
            const { title, images, mal_id, chapters, status, url, scored, synopsis } = result;
            return (
              <div className='sm:flex flex-col justify-center' key={synopsis}>
                <a href={ url } key={ mal_id }  target="_blank" rel="noreferrer" className='flex justify-center items-center cursor-default'>
                    <img src={images.jpg.image_url} alt={`${title} Thumbnail`} key={synopsis} className='p-3 cursor-pointer transistion ml-16 duration-150 transform hover:scale-105 mr-24 md:ml-14 md:mr-36 h-[300px] w-[225px] rounded' />
                  </a>
                  <div className='flex flex-col mr-24 md:mr-20 ml-16 sm:ml-0'>
                  <h1 className='text-xl break-words text-white text-center' key={chapters}>{ title }</h1>
                  <h1 className='text-xl break-words text-white text-center' key={status}>Chapters: { chapters }</h1>
                  <h1 className='text-xl break-words text-white text-center' key={scored}>Status : { status }</h1>
                  <h1 className='text-xl break-words text-white text-center' key={title}>Rating : { scored } Stars</h1>
                  </div>
        </div>
            )
          })}
          <h1 className='text-white pl-10 text-lg'>Reccomended Manga</h1>
          <div className='flex sm:flex-row flex-col'>
          {(Object.values(recdata)).map(resul => {
            const { entry, url, votes } = resul;
            return (
              <div key={url}>
              <div className='flex sm:flex-none justify-center'>
                  <a href="/[id]" as={`/${entry.mal_id}`} key={entry.title} className='flex justify-center items-center cursor-default'>
                    <img src={entry.images.jpg.image_url} key={url} alt={`${entry.title} Thumbnail`} className='p-3 text-center cursor-pointer transistion duration-150 transform hover:scale-105 md:ml-14 md:mr-14 h-[250px] w-[200px] rounded' />
                  </a>
                  </div>
                  <h3 className='break-words text-white text-center'>{entry.title}</h3>
                  </div>
            )
          })}
          </div>
          </div>
      </main>
      </div>
    </div>
  )
}
