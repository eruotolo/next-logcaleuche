-- CreateTable
CREATE TABLE "feed_reactions" (
    "id" SERIAL NOT NULL,
    "feed_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '❤️',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_mentions" (
    "id" SERIAL NOT NULL,
    "feed_id" INTEGER NOT NULL,
    "mentioned_user_id" INTEGER NOT NULL,

    CONSTRAINT "feed_mentions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feed_reactions_feed_id_idx" ON "feed_reactions"("feed_id");

-- CreateIndex
CREATE UNIQUE INDEX "feed_reactions_feed_id_user_id_emoji_key" ON "feed_reactions"("feed_id", "user_id", "emoji");

-- CreateIndex
CREATE INDEX "feed_mentions_mentioned_user_id_idx" ON "feed_mentions"("mentioned_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "feed_mentions_feed_id_mentioned_user_id_key" ON "feed_mentions"("feed_id", "mentioned_user_id");

-- AddForeignKey
ALTER TABLE "feed_reactions" ADD CONSTRAINT "feed_reactions_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feed"("id_Feed") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_reactions" ADD CONSTRAINT "feed_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_mentions" ADD CONSTRAINT "feed_mentions_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feed"("id_Feed") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_mentions" ADD CONSTRAINT "feed_mentions_mentioned_user_id_fkey" FOREIGN KEY ("mentioned_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
