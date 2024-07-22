"use client";

import React, { useState, useEffect } from "react";
import { useLazyGetSummaryQuery } from "@/services/article";
import copy from "@/public/copy.svg";
import tick from "@/public/tick.svg";
import { Text } from "lucide-react";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";

const ArticleSummaryPage = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState<{ url: string; summary: string }[]>([]);
  const [copied, setCopied] = useState("");

  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles") || "[]"
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e: { keyCode?: number; preventDefault?: any }) => {
    e.preventDefault();

    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { url: article.url, summary: data.summary };
      const existingArticleIndex = allArticles.findIndex((item) => item.url === article.url);

      let updatedAllArticles;
      if (existingArticleIndex !== -1) {
        // Update the existing article
        updatedAllArticles = [...allArticles];
        updatedAllArticles[existingArticleIndex] = newArticle;
      } else {
        // Add the new article
        updatedAllArticles = [newArticle, ...allArticles];
      }

      // update state and local storage
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleKeyDown = (e: { keyCode: number }) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  const handleCopy = (copyUrl: string) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 lg:px-8">
      <Heading
        title="Article Summary"
        description="Generate summaries for your articles using advanced AI models."
        icon={Text}
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
      />

      <div className='flex flex-col w-full gap-4'>
        <form
          className='relative flex justify-center items-center w-full gap-2 p-4 bg-white border rounded-lg shadow-sm'
          onSubmit={handleSubmit}
        >
          <input
            type='url'
            placeholder='Paste the article link'
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <Button
            type='submit'
            className='submit_btn peer-focus:border-gray-700'
          >
            Generate
          </Button>
        </form>

        <div className='my-10 max-w-full flex justify-center items-center'>
          {isFetching ? (
            <Loader />
          ) : error ? (
            <p className='font-inter font-bold text-black text-center'>
              Well, that wasn't supposed to happen...
            </p>
          ) : (
            article.summary && (
              <div className='flex flex-col gap-3'>
                <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                  Article <span className='blue_gradient'>Summary</span>
                </h2>
                <div className='summary_box p-4 bg-gray-100 border rounded-md'>
                  <p className='font-inter font-medium text-sm text-gray-700'>
                    {article.summary}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        <div className="space-y-4 mt-4">
          <h3 className="font-satoshi font-bold text-gray-600 text-xl">
            Previously Summarized Articles
          </h3>
          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
            {allArticles.map((item, index) => (
              <div
                key={`link-${index}`}
                className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center">
                  <button
                    onClick={() => handleCopy(item.url)}
                    className="mr-3 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
                  >
                    <img
                      src={copied === item.url ? tick : copy}
                      alt={copied === item.url ? "tick_icon" : "copy_icon"}
                      className="w-4 h-4 object-contain"
                    />
                  </button>
                  <p className="font-satoshi text-blue-700 font-medium text-sm truncate max-w-xs">
                    {item.url}
                  </p>
                </div>
                <Button onClick={() => setArticle(item)} className="text-sm">
                  View Summary
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleSummaryPage;
