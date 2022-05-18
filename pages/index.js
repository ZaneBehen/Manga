import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Sidebar from './Sidebar';

const defaultEndpoint = `https://api.jikan.moe/v3/search/manga&limit=4`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint)
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}



export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data;

  const [results, updateResults] = useState(defaultResults);

  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint
  });
  const { current } = page;

  useEffect(() => {
    // Don't bother making a request if it's the default endpoint as we
    // received that on the server

    if ( current === defaultEndpoint ) return;

    // In order to use async/await, we need an async function, and you can't
    // make the `useEffect` function itself async, so we can create a new
    // function inside to do just that

    async function request() {
      const res = await fetch(current)
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info
      });

      // If we don't have `prev` value, that means that we're on our "first page"
      // of results, so we want to replace the results and start fresh

      if ( !nextData.info?.prev ) {
        updateResults(nextData.results);
        return;
      }

      // Otherwise we want to append our results

      updateResults(prev => {
        return [
          ...prev,
          ...nextData.results
        ]
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage(prev => {
      return {
        ...prev,
        current: page?.next
      }
    });
  }

  function handleOnSubmitSearch(e) {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find(field => field.name === 'query');

    const value = fieldQuery.value || '';
    const endpoint = `https://api.jikan.moe/v3/search/manga?q=${value}&limit=6`;

    updatePage({
      current: endpoint
    });
  }

  return (
    <div className="gradient bg-gradient-to-r from-cyan-500 to-emerald-500 w-full h-screen sm:w-screen flex flex-row sm:overflow-hidden overflow-visible ">
       <Sidebar className='invisible lg:visible '/>
    <div className="flex justify-center flex-shrink-0 sm:flex-shrink w-full">
      <Head>
        <title>Manga Mix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='text-center items-center justify-center flex flex-col'>
      <div className='h-screen sm:h-full'>
        <div>
          <h1 className="text-4xl mr-8 pr-0 text-white mb-2 mt-2">
          Manga Mix
          </h1>
    <form className="flex flex-row mb-2 justify-center" onSubmit={handleOnSubmitSearch}>
      <input type="search" name="query" className="text-start form-control relative flex min-w-0 px-4 mr-5 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search" aria-label="Search" aria-describedby="button-addon3"/>
      <button className="btn inline-block px-6 py-2 border-2 border-blue-600 text-blue-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out" type="submit" id="button-addon3">Search</button>
    </form>
    </div>
  <div className='h-screen w-full'>
        <ul className='flex sm:flex-row flex-col items-center max-w-[100%] justify-center md:justify-between w-full gradient bg-gradient-to-r from-cyan-500 to-emerald-500'>
          <div className='lg:grid lg:grid-cols-3 w-full'>
            {results.map(result => {
            const { mal_id, title, image_url } = result;
            return (
                <Link href={`/${mal_id}`} key={title} >
                  <div className="mr-10">
                    <img src={image_url} alt={` Image Thumbnail`} key={mal_id} className=' grid row-span-1 text-center cursor-pointer transistion duration-150 transform hover:scale-105 mr-14 h-[292px] w-[160] mb-1 ml-[66px] rounded' />
                  <h3 className='break-words text-white text-center' key={image_url}>{ title }</h3>
                  </div>
                </Link>
            )
          })}
          </div>
        </ul>
        </div>
        </div>
      </main>
    </div>
    </div>
  )
}
