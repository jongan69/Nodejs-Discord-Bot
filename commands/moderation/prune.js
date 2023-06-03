const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('Prune up to 99 messages.')
		.addIntegerOption(option => option.setName('amount').setDescription('Number of messages to prune')),
	async execute(interaction) {
    await interaction.deferReply({ ephemeral: true })
		const amount = interaction.options.getInteger('amount');

		if (amount < 1 || amount > 99) {
			return interaction.editReply({ content: 'You need to input a number between 1 and 99.', ephemeral: true });
		}
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.editReply({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
		});

		return interaction.editReply({ content: `Successfully pruned \`${amount}\` messages.`, ephemeral: true });
	},
};